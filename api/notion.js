import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let priceHistory = {};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  try {
    // Leer desde Notion API con fetch
    const notionRes = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (!notionRes.ok) {
      throw new Error(`Notion API error: ${notionRes.status}`);
    }

    const data = await notionRes.json();

    const positions = data.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        ticker: props.Ticker?.title?.[0]?.plain_text || "N/A",
        precioActual: parseFloat(props["Precio Actual"]?.number) || 0,
        precioPromedio: parseFloat(props["Precio Promedio"]?.number) || 0,
      };
    });

    // Detectar cambios >3%
    for (const pos of positions) {
      const oldPrice = priceHistory[pos.ticker];

      if (oldPrice && oldPrice !== pos.precioActual) {
        const changePercent = ((pos.precioActual - oldPrice) / oldPrice) * 100;

        if (Math.abs(changePercent) > 3) {
          const direction = changePercent > 0 ? "📈 SUBIÓ" : "📉 BAJÓ";
          const message = `
🚨 ALERTA PORTAFOLIO

${pos.ticker} ${direction}

Cambio: ${changePercent.toFixed(2)}%
Anterior: $${oldPrice.toFixed(2)}
Actual: $${pos.precioActual.toFixed(2)}

Verifica en: https://mi-portafolio-bmv.vercel.app/
          `.trim();

          await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: process.env.TWILIO_WHATSAPP_TO,
            body: message,
          });

          console.log(`✅ WhatsApp enviado para ${pos.ticker}`);
        }
      }

      priceHistory[pos.ticker] = pos.precioActual;
    }

    res.status(200).json({
      success: true,
      positions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: error.message || "Error en sincronización",
    });
  }
}
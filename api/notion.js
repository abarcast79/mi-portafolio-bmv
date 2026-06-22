const { Client } = require("@notionhq/client");
const twilio = require("twilio");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Base de datos histórica (en memoria, temporal)
let priceHistory = {};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  try {
    // 1️⃣ Leer posiciones de Notion
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    const positions = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        ticker: props.Ticker?.title?.[0]?.plain_text || "N/A",
        precioActual:
          parseFloat(props["Precio Actual"]?.number) || 0,
        precioPromedio:
          parseFloat(props["Precio Promedio"]?.number) || 0,
      };
    });

    // 2️⃣ Comparar precios y detectar cambios >3%
    for (const pos of positions) {
      const oldPrice = priceHistory[pos.ticker];

      if (oldPrice && oldPrice !== pos.precioActual) {
        const changePercent =
          ((pos.precioActual - oldPrice) / oldPrice) * 100;

        // 3️⃣ Si cambio >3%, enviar WhatsApp
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

          // Enviar por WhatsApp
          await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: process.env.TWILIO_WHATSAPP_TO,
            body: message,
          });

          console.log(`✅ WhatsApp enviado para ${pos.ticker}`);
        }
      }

      // Actualizar historial
      priceHistory[pos.ticker] = pos.precioActual;
    }

    // 4️⃣ Retornar datos al frontend
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
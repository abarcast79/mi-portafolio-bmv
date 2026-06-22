export default async function handler(req, res) {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = '82d7318bf1c146cc9129961b7bb36dc7';

  if (!NOTION_TOKEN) {
    return res.status(400).json({ error: 'NOTION_TOKEN no configurado' });
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      console.error('Notion API error:', response.status, await response.text());
      return res.status(response.status).json({ error: 'Error al conectar con Notion' });
    }

    const data = await response.json();

    // Transformar datos de Notion a formato del dashboard
    const positions = data.results.map((page) => {
      const props = page.properties;
      return {
        id: props.Ticker.title[0]?.plain_text || 'Unknown',
        ticker: props.Ticker.title[0]?.plain_text || 'Unknown',
        cantidad: props.Cantidad.number || 0,
        precioCosto: props['Precio Costo'].number || 0,
        precioActual: props['Precio Actual'].number || 0,
        estado: props.Estado.select?.name || 'análisis',
      };
    });

    res.status(200).json(positions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al procesar solicitud', details: error.message });
  }
}
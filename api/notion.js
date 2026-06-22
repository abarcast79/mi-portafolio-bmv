import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  try {
    console.log("Token:", process.env.NOTION_TOKEN?.substring(0, 10));
    console.log("Database ID:", process.env.NOTION_DATABASE_ID);

    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    res.status(200).json({
      success: true,
      count: response.results.length,
      data: response.results.map(p => ({
        ticker: p.properties.Ticker?.title?.[0]?.plain_text,
        precio: p.properties["Precio Actual"]?.number
      }))
    });
  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({ error: error.message });
  }
}
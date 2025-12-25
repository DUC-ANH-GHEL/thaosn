import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const data = await sql`
        SELECT id, name, message, color, created_at
        FROM wishes
        ORDER BY created_at ASC
      `;
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { name, message } = req.body;

      if (!name || !message || message.length > 150) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`;

      const [wish] = await sql`
        INSERT INTO wishes (name, message, color)
        VALUES (${name}, ${message}, ${color})
        RETURNING *
      `;

      return res.status(200).json(wish);
    }

    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

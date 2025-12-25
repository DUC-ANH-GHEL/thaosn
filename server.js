import 'dotenv/config';
import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";

const app = express();
app.use(cors());
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

app.get("/api/wishes", async (req, res) => {
  const data = await sql`
    SELECT id, name, message, color, created_at
    FROM wishes
    ORDER BY created_at ASC
  `;
  res.json(data);
});

app.post("/api/wishes", async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).end();

  const color = `hsl(${Math.random() * 360},80%,70%)`;
  const [wish] = await sql`
    INSERT INTO wishes (name, message, color)
    VALUES (${name}, ${message}, ${color})
    RETURNING *
  `;
  res.json(wish);
});

app.use(express.static("public"));

app.listen(8000, () => {
  console.log("Local server running at http://localhost:8000");
});

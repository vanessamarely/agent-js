import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generar-gpt", async (req, res) => {
  const { dieta, intolerancias, objetivo } = req.body;

  const prompt = `
Eres un chef experto en cocina saludable.
El usuario tiene una dieta ${dieta}.
Debe evitar: ${intolerancias.join(", ")}.
Su objetivo es: ${objetivo}.
Genera un plan de comida saludable para un día completo: desayuno, almuerzo y cena.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // ✅ usamos gpt-4o
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const respuesta = completion.choices[0].message.content;
    res.json({ respuesta });
  } catch (error) {
    console.error("Error con OpenAI:", error);
    res.status(500).send("Error al generar contenido");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

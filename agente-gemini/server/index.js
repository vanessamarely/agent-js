import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

// Setup ES Module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carga de variables de entorno
dotenv.config();

// Configurar Express
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Configurar Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/generar", async (req, res) => {
  const { dieta, intolerancias, objetivo } = req.body;

  const prompt = `
Eres un chef de cocina saludable.
El usuario tiene una dieta ${dieta}.
Evita: ${intolerancias.join(", ")}.
Objetivo: ${objetivo}.
Genera un plan de comida saludable para un día completo: desayuno, almuerzo y cena.
`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    res.json({ respuesta: result.text });
  } catch (error) {
    console.error("Error con Gemini:", error);
    res.status(500).send("Error al generar contenido");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

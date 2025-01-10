const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Cambiar a Vertex AI
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors({ origin: 'https://albertodg85.github.io' })); // Ajusta el origen según sea necesario
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY); // Usar GoogleGenerativeAI

app.post('/api/recomendaciones', async (req, res) => {
    try {
        const { cantidad, moneda } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro"}); // Inicializar el modelo

        const prompt = `Recomienda 4 criptomonedas para invertir ${cantidad} ${moneda}, categorizadas en corto plazo (25%), medio plazo (50%) y largo plazo (25%). Proporciona la respuesta en formato JSON como este ejemplo:
        \`\`\`json
        {
          "cortoPlazo": [
            { "nombre": "Bitcoin (BTC)", "cantidad": "500" }
          ],
          "medioPlazo": [
            { "nombre": "Ethereum (ETH)", "cantidad": "750" },
            { "nombre": "Solana (SOL)", "cantidad": "500" }
          ],
          "largoPlazo": [
            { "nombre": "Chainlink (LINK)", "cantidad": "250" }
          ]
        }
        \`\`\`
        `;

        const result = await model.generateContent(prompt); // Usar generateContent en lugar de createChat
        const response = await result.response;
        const text = response.text();

        console.log("Respuesta de Gemini:", text);

        res.json({ respuesta: text });
    } catch (error) {
        console.error("Error al obtener recomendaciones:", error);
        res.status(500).json({ error: 'Error al obtener recomendaciones' });
    }
});

app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
});

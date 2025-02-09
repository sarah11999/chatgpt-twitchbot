const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", async (req, res) => {
    const frage = req.query.frage || "Sag etwas Lustiges!";

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: frage }]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.send(response.data.choices[0].message.content);
    } catch (error) {
        res.send("Fehler: OpenAI API nicht erreichbar.");
    }
});

app.listen(3000, () => console.log("Bot läuft auf Port 3000"));

const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
    let frage = req.query.frage;

    if (!frage || frage.trim() === "") {
        frage = "Sag etwas Lustiges!";
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: frage }],
                temperature: 0.7,
                max_tokens: 400
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let antwort = response.data.choices[0].message.content
            .replace(/\n/g, " ")
            .replace(/"/g, "'")
            .replace(/&/g, "und")
            .replace(/%/g, " Prozent");

        const maxLaenge = 350;
if (antwort.length > maxLaenge) {
    let letzteWoerter = antwort.substring(0, maxLaenge).split(" ");
    letzteWoerter.pop(); // Letztes unvollständiges Wort entfernen
    antwort = letzteWoerter.join(" ") + "..."; // "..." für besseren Übergang
}
res.send(antwort);
    } catch (error) {
        console.error("Fehler beim Abrufen der OpenAI API:", error);
        res.send("Fehler: OpenAI API nicht erreichbar.");
    }
});

// Server auf Port 3000 starten
app.listen(3000, () => console.log("Bot läuft auf Port 3000"));

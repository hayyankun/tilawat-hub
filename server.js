const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/", (req, res) => {
    console.log("Request received:", JSON.stringify(req.body, null, 2));

    res.json({
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: "Playing a random Surah.",
            },
            shouldEndSession: false,
        },
    });
});

app.get("/", (req, res) => {
    res.send("Tilawat Hub Backend is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

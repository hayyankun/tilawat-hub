const express = require("express");
const bodyParser = require("body-parser");
const Alexa = require("ask-sdk-core");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// ✅ Test Route to check if the server is running
app.get("/", (req, res) => {
    res.send("Tilawat Hub Backend is Running!");
});

// ✅ List of Yasser Al-Dosari's recitations from MP3Quran
const surahList = [
    "https://server10.mp3quran.net/yasser/001.mp3",
    "https://server10.mp3quran.net/yasser/002.mp3",
    "https://server10.mp3quran.net/yasser/003.mp3",
    "https://server10.mp3quran.net/yasser/004.mp3",
    "https://server10.mp3quran.net/yasser/005.mp3",
    "https://server10.mp3quran.net/yasser/006.mp3",
    "https://server10.mp3quran.net/yasser/007.mp3",
    "https://server10.mp3quran.net/yasser/008.mp3",
    "https://server10.mp3quran.net/yasser/009.mp3",
    "https://server10.mp3quran.net/yasser/010.mp3"
];

// ✅ Function to get a random Surah
function getRandomSurah() {
    return surahList[Math.floor(Math.random() * surahList.length)];
}

// ✅ Alexa Skill Handlers
const PlayRandomQuranHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayRandomQuranIntent';
    },
    handle(handlerInput) {
        const surahUrl = getRandomSurah();

        return handlerInput.responseBuilder
            .speak("Playing a random Surah.")
            .addDirective({
                type: 'AudioPlayer.Play',
                playBehavior: 'REPLACE_ALL',
                audioItem: {
                    stream: {
                        url: surahUrl,
                        token: "random_surah",
                        offsetInMilliseconds: 0
                    }
                }
            })
            .getResponse();
    }
};

// ✅ Stop Intent Handler
const StopHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .addDirective({
                type: 'AudioPlayer.Stop'
            })
            .getResponse();
    }
};

// ✅ Error Handler
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error: ${error.message}`);
        return handlerInput.responseBuilder
            .speak("Sorry, an error occurred. Please try again later.")
            .getResponse();
    }
};

// ✅ Alexa Handler Function
const skill = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        PlayRandomQuranHandler,
        StopHandler
    )
    .addErrorHandlers(ErrorHandler)
    .create();

// ✅ POST Route for Alexa Skill
app.post("/alexa", async (req, res) => {
    try {
        const response = await skill.invoke(req.body);
        res.json(response);
    } catch (error) {
        console.error("Alexa Skill Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

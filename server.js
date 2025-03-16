const Alexa = require('ask-sdk-core');

// List of Yasser Al-Dosari's recitations from MP3Quran
const surahList = [
    "https://server10.mp3quran.net/yasser/001.mp3",  // Surah Al-Fatiha
    "https://server10.mp3quran.net/yasser/002.mp3",  // Surah Al-Baqarah
    "https://server10.mp3quran.net/yasser/003.mp3",  // Surah Aal-E-Imran
    "https://server10.mp3quran.net/yasser/004.mp3",  // Surah An-Nisa
    "https://server10.mp3quran.net/yasser/005.mp3",  // Surah Al-Ma'idah
    "https://server10.mp3quran.net/yasser/006.mp3",  // Surah Al-An'am
    "https://server10.mp3quran.net/yasser/007.mp3",  // Surah Al-A'raf
    "https://server10.mp3quran.net/yasser/008.mp3",  // Surah Al-Anfal
    "https://server10.mp3quran.net/yasser/009.mp3",  // Surah At-Tawbah
    "https://server10.mp3quran.net/yasser/010.mp3"   // Surah Yunus
];

// Function to get a random Surah
function getRandomSurah() {
    return surahList[Math.floor(Math.random() * surahList.length)];
}

// Handler for the PlayRandomQuranIntent
const PlayRandomQuranHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayRandomQuranIntent';
    },
    handle(handlerInput) {
        const surahUrl = getRandomSurah();

        return handlerInput.responseBuilder
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

// Stop the audio
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

// Error Handling
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error: ${error.message}`);
        return handlerInput.responseBuilder
            .speak("Sorry, there was an error. Please try again later.")
            .getResponse();
    }
};

// Skill Builder
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        PlayRandomQuranHandler,
        StopHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();

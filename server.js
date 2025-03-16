const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const RECITER_ID = 8; // Yasser Al-Dosari

app.post('/', async (req, res) => {
    try {
        const randomSurah = Math.floor(Math.random() * 114) + 1; // Random Surah (1-114)
        
        // Fetch audio file from Quran.com API
        const response = await axios.get(`https://api.quran.com/api/v4/chapter_recitations/${RECITER_ID}/${randomSurah}`);
        
        if (!response.data.audio_file) {
            return res.json({
                response: {
                    outputSpeech: {
                        type: "PlainText",
                        text: "Sorry, I couldn't find the surah audio."
                    },
                    shouldEndSession: true
                }
            });
        }

        const audioUrl = response.data.audio_file.audio_url;

        return res.json({
            response: {
                outputSpeech: {
                    type: "SSML",
                    ssml: `<speak>Playing Surah number ${randomSurah} by Yasser Al-Dosari. <audio src="${audioUrl}" /></speak>`
                },
                shouldEndSession: true
            }
        });

    } catch (error) {
        console.error(error);
        return res.json({
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: "There was an error fetching the surah. Please try again later."
                },
                shouldEndSession: true
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

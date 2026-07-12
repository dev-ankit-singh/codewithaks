// const express = require("express");
// const { GoogleGenAI } = require("@google/genai");
// const myInfo = require("../ai/myInfo");

// const router = express.Router();

// const ai = new GoogleGenAI({
//     apiKey: process.env.CODE_API_AKS
// });

// router.post("/chat", async (req, res) => {
//     try {

//         const { message } = req.body;

//         if (!message) {
//             return res.status(400).json({
//                 success: false,
//                 reply: "Message is required."
//             });
//         }

//         const prompt = `
// ${myInfo}

// User Question:
// ${message}
// `;

//         const result = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: prompt
//         });

//         return res.json({
//             success: true,
//             reply: result.text
//         });

//     } catch (error) {

//         console.error("Gemini Error:", error);

//         return res.status(500).json({
//             success: false,
//             reply: "Something went wrong."
//         });

//     }
// });

// module.exports = router;

// uper wala code bass comment out karna hai pura gemini ka hai 

const express = require("express");
const Groq = require("groq-sdk");
const myInfo = require("../ai/myInfo");

const router = express.Router();

const groq = new Groq({
    apiKey: process.env.CODE_API_AKS
});

router.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                reply: "Message is required."
            });
        }

        const completion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [

                {
                    role: "system",
                    content: myInfo
                },

                {
                    role: "user",
                    content: message
                }

            ],

            temperature: 0.5,
            max_tokens: 1024

        });

        return res.json({

            success: true,

            reply: completion.choices[0].message.content

        });

    } catch (error) {

        console.error("Groq Error:", error);

        return res.status(500).json({

            success: false,

            reply: "Sorry, AI is currently unavailable."

        });

    }

});

module.exports = router;
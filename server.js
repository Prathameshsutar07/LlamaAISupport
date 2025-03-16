require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const compression = require("compression");
const winston = require("winston");
const stringSimilarity = require("string-similarity");
const knowledgeBase = require("./knowledgeBase");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(compression()); // Enable gzip compression

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

// Cache for faster repeat responses
const responseCache = new Map();

// **Find Best Match in a Category**
const findBestMatchInCategory = (query, categoryData) => {
    const questions = Object.keys(categoryData);
    const { bestMatch } = stringSimilarity.findBestMatch(query.toLowerCase(), questions);

    return bestMatch.rating > 0.7 ? categoryData[bestMatch.target] : null;
};

// **Find Answer in Knowledge Base**
const findAnswer = (query) => {
    for (const category in knowledgeBase) {
        const answer = findBestMatchInCategory(query, knowledgeBase[category]);
        if (answer) return answer;
    }
    return null;
};

// **Fetch AI response**
const getAIResponse = async (query) => {
    if (responseCache.has(query)) {
        return responseCache.get(query); // ✅ Fastest lookup for repeated queries
    }

    const kbAnswer = findAnswer(query);
    if (kbAnswer) {
        responseCache.set(query, kbAnswer); // ✅ Cache the response
        return kbAnswer;
    }

    // ❌ No match found, ask AI
    try {
        const preprocessedFAQs = Object.entries(knowledgeBase)
            .flatMap(([category, questions]) =>
                Object.entries(questions).map(([q, a]) => `${q}: ${a}`)
            )
            .join("\n\n");

        const { data } = await axios.post("http://localhost:11434/api/chat", {
            model: "llama2",
            max_tokens: 500,
            messages: [
                { role: "system", content: "Answer concisely using the provided FAQs. If no exact match is found, generate a brief response based on the knowledge base."},
                { role: "user", content: `FAQs:\n\n${preprocessedFAQs}\n\nQuestion: "${query}"` }
            ],
            stream: false
        });

        const aiAnswer = data.message?.content?.trim() || "No relevant answer found.";
        responseCache.set(query, aiAnswer); // ✅ Cache AI response
        return aiAnswer;
    } catch (error) {
        logger.error("AI API Error:", error.message);
        return "Sorry, I'm unable to process your request at the moment.";
    }
};

// **Chat API Endpoint**
app.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ response: "Message is required." });
    console.log(message);
    const answer = await getAIResponse(message);
    logger.info("AI Response:", { answer });

    res.json({ response: answer });
});

// **Start Server**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

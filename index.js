const express = require("express");
const fetch = require("node-fetch");
const Tesseract = require("tesseract.js");

const app = express();
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
    res.send("OCR API is running!");
});

// OCR route
app.post("/extract-text", async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Please provide an imageUrl in the request body." });
    }

    try {
        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error("Unable to fetch the image. Please check the URL.");
        }

        const buffer = await response.buffer();

        // Perform OCR using Tesseract.js
        Tesseract.recognize(buffer, "eng")
            .then(({ data: { text } }) => {
                res.json({ text });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: "OCR processing failed." });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch the image." });
    }
});

// Start the server locally for testing
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

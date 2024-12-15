const express = require("express");
const Tesseract = require("tesseract.js");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.send("OCR API is running. Use the /extract-text endpoint.");
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
            throw new Error("Unable to fetch the image. Check the URL.");
        }

        const buffer = await response.buffer();

        // Perform OCR
        Tesseract.recognize(buffer, "eng", {
            logger: (info) => console.log(info), // Optional: Log progress
        })
            .then(({ data: { text } }) => {
                res.json({ text });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "Error processing the image for OCR." });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch the image. Ensure the URL is correct." });
    }
});

// Start server locally (for testing)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

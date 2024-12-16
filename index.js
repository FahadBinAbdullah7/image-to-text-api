const express = require("express");
const Tesseract = require("tesseract.js");
const axios = require("axios");

const app = express();
app.use(express.json());

// Health check route for testing
app.get("/", (req, res) => {
    res.send("API is working!");
});

// OCR Route
app.post("/extract-text", async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    try {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data, "binary");

        const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng", {
            logger: info => console.log(info) // Optional: Log progress
        });

        return res.status(200).json({ text });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Failed to process the image." });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

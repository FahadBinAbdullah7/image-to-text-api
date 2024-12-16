const express = require("express");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const { URL } = require("url");

const app = express();
app.use(express.json());

// Endpoint for OCR
app.post("/extract-text", async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    try {
        // Validate the URL
        new URL(imageUrl);

        // Fetch the image
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data, "binary");

        // Perform OCR
        const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng", {
            logger: info => console.log(info) // Log progress (optional)
        });

        return res.status(200).json({ text });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Failed to process the image." });
    }
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

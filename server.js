const express = require("express");
const axios = require("axios");
const Tesseract = require("tesseract.js");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static frontend files

// API to extract text from an image URL
app.post("/api/extract", async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl || !imageUrl.startsWith("http")) {
        return res.status(400).json({ error: "Invalid or missing image URL." });
    }

    try {
        // Fetch the image as a buffer
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data, "binary");

        // Perform OCR
        const { data } = await Tesseract.recognize(imageBuffer, "eng", {
            logger: (info) => console.log(info), // Optional: log progress
        });

        return res.status(200).json({ text: data.text });
    } catch (error) {
        console.error("OCR error:", error.message);
        return res.status(500).json({ error: "Failed to process the image." });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const cors = require("cors"); // Added for CORS

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(express.static("public")); // Serve static files

// Serve the frontend
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// OCR API Endpoint
app.post("/extract-text", async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    try {
        // Fetch image from the provided URL
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data, "binary");

        // Perform OCR using Tesseract.js
        const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng", {
            logger: info => console.log(info) // Optional: Log progress
        });

        // Return extracted text
        return res.status(200).json({ text });
    } catch (error) {
        console.error("Error during OCR:", error.message);
        return res.status(500).json({ error: `Failed to process the image: ${error.message}` });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

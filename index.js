const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Tesseract = require("tesseract.js");

const app = express();

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// POST route for OCR
app.post("/extract-text", async (req, res) => {
    const { imageUrl } = req.body;

    // Check if the image URL is provided
    if (!imageUrl) {
        console.log("No image URL provided");
        return res.status(400).json({ error: "Image URL is required" });
    }

    try {
        console.log("Fetching image from URL:", imageUrl);
        
        // Fetch the image from the URL as a buffer
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data, "binary");

        console.log("Running OCR on the image...");
        
        // Run Tesseract OCR on the image buffer
        const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng", {
            logger: (info) => console.log(info) // Optional: Log OCR progress
        });

        console.log("OCR text extracted:", text);
        return res.status(200).json({ text });
    } catch (error) {
        console.error("Error during OCR:", error.message);
        return res.status(500).json({ error: `Failed to process the image: ${error.message}` });
    }
});

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

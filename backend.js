const express = require("express");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to fetch image buffer
async function fetchImageBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return Buffer.from(response.data, "binary");
    } catch (error) {
        throw new Error("Failed to fetch image from URL.");
    }
}

// OCR Route
app.post("/extract-text", async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required." });
    }

    try {
        const imageBuffer = await fetchImageBuffer(imageUrl);
        Tesseract.recognize(imageBuffer, "eng", {
            logger: (info) => console.log(info),
        })
            .then(({ data: { text } }) => {
                res.json({ text });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "OCR processing failed." });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to the Image-to-Text API!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

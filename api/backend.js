const axios = require("axios");
const Tesseract = require("tesseract.js");

const express = require("express");
const app = express();
app.use(express.json());

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
            logger: (info) => console.log("Tesseract progress:", info),
        });

        return res.status(200).json({ text: data.text });
    } catch (error) {
        console.error("Error during OCR:", error.message);
        return res.status(500).json({ error: "Internal Server Error. Could not process the image." });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

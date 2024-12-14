const Tesseract = require("tesseract.js");
const axios = require("axios");

// Serverless Function Handler
module.exports = async (req, res) => {
    if (req.method === "POST") {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: "Image URL is required." });
        }

        try {
            const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
            const imageBuffer = Buffer.from(response.data, "binary");

            const result = await Tesseract.recognize(imageBuffer, "eng");
            res.status(200).json({ text: result.data.text });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error during OCR processing." });
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};

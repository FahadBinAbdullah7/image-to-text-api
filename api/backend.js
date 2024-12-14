const axios = require("axios");
const Tesseract = require("tesseract.js");

module.exports = async (req, res) => {
    try {
        if (req.method === "POST") {
            const { imageUrl } = req.body;

            // Validate image URL
            if (!imageUrl || !imageUrl.startsWith("http")) {
                return res.status(400).json({ error: "Invalid or missing image URL." });
            }

            console.log("Received imageUrl:", imageUrl);

            // Fetch image from the provided URL
            const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
            const imageBuffer = Buffer.from(response.data, "binary");
            console.log("Image successfully fetched.");

            // Process OCR using Tesseract.js
            const result = await Tesseract.recognize(imageBuffer, "eng", {
                logger: (info) => console.log("Tesseract progress:", info),
            });

            console.log("OCR Result:", result.data.text);
            return res.status(200).json({ text: result.data.text });
        } else {
            res.setHeader("Allow", "POST");
            return res.status(405).json({ error: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("Error occurred:", error.message);
        console.error("Stack trace:", error.stack);
        return res.status(500).json({ error: "Internal server error. Please check the server logs." });
    }
};

const axios = require("axios");
const Tesseract = require("tesseract.js");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { imageUrl } = req.body;

    if (!imageUrl || !imageUrl.startsWith("http")) {
        return res.status(400).json({ error: "Invalid or missing image URL." });
    }

    try {
        // Fetch the image
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data, "binary");

        // Perform OCR
        const { data } = await Tesseract.recognize(imageBuffer, "eng", {
            logger: (info) => console.log("Tesseract progress:", info),
        });

        return res.status(200).json({ text: data.text });
    } catch (error) {
        console.error("Error during OCR:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

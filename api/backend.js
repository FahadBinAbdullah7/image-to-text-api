module.exports = async (req, res) => {
    try {
        if (req.method === "POST") {
            const { imageUrl } = req.body;

            if (!imageUrl) {
                console.error("No image URL provided.");
                return res.status(400).json({ error: "Image URL is required." });
            }

            const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
            const imageBuffer = Buffer.from(response.data, "binary");

            const result = await Tesseract.recognize(imageBuffer, "eng", {
                logger: (info) => console.log(info), // Log OCR progress
            });

            console.log("OCR Result:", result.data.text);
            return res.status(200).json({ text: result.data.text });
        } else {
            res.setHeader("Allow", "POST");
            return res.status(405).json({ error: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).json({ error: "Internal server error. Please check the server logs." });
    }
};

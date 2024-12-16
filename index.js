const express = require('express');
const axios = require('axios');
const Tesseract = require('tesseract.js');
const cors = require('cors');

const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Parse JSON bodies for POST requests
app.use(express.json());

// POST route to accept the image URL and process it
app.post('/extract-text', async (req, res) => {
    const { imageUrl } = req.body; // Get the image URL from the request body

    // Check if the image URL was provided
    if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required.' });
    }

    try {
        // Fetch the image from the provided URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Perform OCR on the image using Tesseract
        Tesseract.recognize(
            imageBuffer,
            'eng', // Specify the language
            {
                logger: (m) => console.log(m), // Log OCR progress (optional)
            }
        ).then(({ data: { text } }) => {
            // Send the extracted text as the response
            res.status(200).json({ text });
        }).catch((error) => {
            // Error occurred during OCR
            res.status(500).json({ error: `OCR failed: ${error.message}` });
        });

    } catch (error) {
        // Error occurred while fetching the image
        res.status(500).json({ error: `Image fetch failed: ${error.message}` });
    }
});

// Set the port for the server to listen on
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

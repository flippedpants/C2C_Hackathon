const multer = require('multer');
const { analyzeImageBufferWithPrompt } = require('../models/vision');

const upload = multer({ storage: multer.memoryStorage() });

const askStylistWithImage = async (req, res) => {
  try {
    const question = `
    You are a fashion classification AI. Analyze the uploaded garment image and classify it strictly into the predefined categories.  

    Return only valid JSON in the following structure:

    {
    "type": "Top | Bottom | Dress | Outerwear | Footwear | Accessory",
    "subcategory": "Choose from allowed subcategories for the given type",
    "color": "Black | White | Blue | Red | Green | Orange | Yellow | Beige | Multi-color",
    "occasion": "Casual | Formal | Party | Sports | Travel",
    "season": "Summer | Winter | All-season"
    }

    Rules:
    - Always select from the given options. 
    - If multiple values apply, choose the most dominant/appropriate one. 
    - Do not include explanations, only the JSON object.
    `;

    if (!req.file)
        return res.status(400).json({ error: 'Missing image file' });

    const imageBuffer = req.file.buffer; 

    const response = await analyzeImageBufferWithPrompt(imageBuffer, question);

    res.status(200).json({ response });
  } catch (error) {
    console.error('Error processing image:', error.message);
    res.status(500).json({ error: 'Failed to process image and question' });
  }
};

module.exports = { askStylistWithImage, upload };

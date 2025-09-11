const Stylist = require('../models/stylist');

const askStylist = async(req, res) => {
    const uid = req.params.uid;
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ 
            success: false,
            error: 'Question is required' 
        });
    }

    if (!uid) {
        return res.status(400).json({ 
            success: false,
            error: 'User ID is required' 
        });
    }

    try {
        const answer = await Stylist.askStylistLLM(uid, question);
        res.status(200).json({ 
            success: true,
            answer: answer,
            userId: uid
        });
    } catch (error) {
        console.error('Stylist error: ', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
}

module.exports = { askStylist }

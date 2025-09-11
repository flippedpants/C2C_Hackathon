const { genAI } = require('../config/gemini');
//const { db } = require('../config/firebase');
//const WARDROBE = 'wardrobes';

// const getWardrobeByUid = async(uid) => {
//     const docRef = db.collection(WARDROBE).doc(uid);
//     const doc = await docRef.get();
//     if (!doc.exists) {
//         throw new Error('No such wardrobe!');
//     }

//     const itemsObj = doc.data().items || {};
// }

const askStylistLLM = async(useId, question) => {
    const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});
    
    const prompt = `
    You are a virtual stylist for a user, answer their queries`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiAnswer = response.text();
    return aiAnswer;
};

module.exports = { askStylistLLM }
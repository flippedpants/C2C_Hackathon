const { admin, db } = require('../config/firebaseAdmin');
const WARDROBE_COLLECTION = 'wardrobes';

//const WARDROBE_COLLECTION = 'wardrobes';

const addItemToWardrobe = async (uid, itemId, aiResponse) => {
    try {
        // Extract JSON from the AI response
        const parsedItem = extractAndParseResponse(aiResponse);
        
        // Validate the parsed item
        validateGarmentData(parsedItem);
        
        // Add metadata to the item
        const item = {
            id: itemId,
            ...parsedItem,
            dateAdded: new Date(),
            lastWorn: null,
            timesWorn: 0
        };

        const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
        const docSnapshot = await docRef.get();

        // If document doesn't exist, create it with the new item
        if (!docSnapshot.exists) {
            await docRef.set({
                userId: uid,
                items: {
                    [itemId]: item
                },
                createdAt: new Date(),
                updatedAt: new Date(),
                totalItems: 1
            });
        } else {
            // If document exists, safely add item to the existing map
            const currentData = docSnapshot.data();
            const currentItems = currentData.items || {};
            const totalItems = Object.keys(currentItems).length + 1;
            
            await docRef.update({
                [`items.${itemId}`]: item,
                updatedAt: new Date(),
                totalItems: totalItems
            });
        }

        return { success: true, item, itemId };
        
    } catch (error) {
        console.error('Error adding item to wardrobe:', error);
        throw new Error(`Failed to add item to wardrobe: ${error.message}`);
    }
};

// Fetch wardrobe by user id
const getWardrobeByUid = async (uid) => {
    const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
        return { exists: false };
    }
    const data = snapshot.data();
    return { exists: true, ...data };
};

// Filter garments by provided filters
const getGarmentsByFilter = async (uid, filters) => {
    const wardrobe = await getWardrobeByUid(uid);
    if (!wardrobe.exists || !wardrobe.items) return [];
    const items = Object.values(wardrobe.items);
    return items.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            return (item[key] === value);
        });
    });
};

// Increment timesWorn and update lastWorn
const updateGarmentUsage = async (uid, itemId) => {
    const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
    const snapshot = await docRef.get();
    if (!snapshot.exists) throw new Error('Wardrobe not found');
    const data = snapshot.data();
    const items = data.items || {};
    if (!items[itemId]) throw new Error('Item not found');

    const currentTimesWorn = items[itemId].timesWorn || 0;

    await docRef.update({
        [`items.${itemId}.timesWorn`]: currentTimesWorn + 1,
        [`items.${itemId}.lastWorn`]: new Date(),
        updatedAt: new Date()
    });
};

// Delete garment
const deleteGarment = async (uid, itemId) => {
    const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return;
    const data = snapshot.data();
    const items = data.items || {};
    if (!items[itemId]) return;

    // Compute new total
    const newTotal = Math.max(0, (data.totalItems || Object.keys(items).length) - 1);

    await docRef.update({
        [`items.${itemId}`]: admin.firestore.FieldValue.delete ? admin.firestore.FieldValue.delete() : null,
        updatedAt: new Date(),
        totalItems: newTotal
    });

    // If FieldValue.delete not available fallback to rewrite items map
    if (!admin.firestore.FieldValue || !admin.firestore.FieldValue.delete) {
        delete items[itemId];
        await docRef.set({
            ...data,
            items,
            totalItems: Object.keys(items).length,
            updatedAt: new Date()
        });
    }
};

// Helper function to extract and parse JSON from AI response
const extractAndParseResponse = (aiResponse) => {
    try {
        let jsonString = '';
        
        // Handle different response formats
        if (typeof aiResponse === 'string') {
            // If it's already a JSON string, try to parse it directly
            if (aiResponse.trim().startsWith('{') && aiResponse.trim().endsWith('}')) {
                jsonString = aiResponse.trim();
            } else {
                // Extract from markdown code block
                jsonString = extractFromMarkdown(aiResponse);
            }
        } else if (typeof aiResponse === 'object' && aiResponse.response) {
            // Handle the format: { "response": "```json\n{...}\n```" }
            jsonString = extractFromMarkdown(aiResponse.response);
        } else if (typeof aiResponse === 'object') {
            // If it's already a parsed object, return it
            return aiResponse;
        } else {
            throw new Error('Invalid AI response format');
        }

        // Parse the JSON string
        const parsed = JSON.parse(jsonString);
        return parsed;
        
    } catch (error) {
        console.error('Error extracting JSON from response:', error);
        console.error('Original response:', aiResponse);
        throw new Error('Failed to parse AI response JSON');
    }
};

// Helper function to extract JSON from markdown code blocks
const extractFromMarkdown = (text) => {
    // Remove markdown code block markers
    let jsonString = text
        .replace(/```json\n?/g, '')  // Remove opening ```json
        .replace(/```\n?/g, '')     // Remove closing ```
        .replace(/`/g, '')          // Remove any remaining backticks
        .trim();

    // Find JSON object boundaries
    const startIndex = jsonString.indexOf('{');
    const lastIndex = jsonString.lastIndexOf('}');
    
    if (startIndex === -1 || lastIndex === -1 || startIndex >= lastIndex) {
        throw new Error('No valid JSON object found in response');
    }
    
    return jsonString.substring(startIndex, lastIndex + 1);
};

// Helper function to validate garment data
const validateGarmentData = (item) => {
    const requiredFields = ['type', 'subcategory', 'color', 'occasion', 'season'];
    const validValues = {
        type: ['Top', 'Bottom', 'Dress', 'Outerwear', 'Footwear', 'Accessory'],
        color: ['Black', 'White', 'Blue', 'Red', 'Green', 'Orange', 'Yellow', 'Beige', 'Multi-color'],
        occasion: ['Casual', 'Formal', 'Party', 'Sports', 'Travel'],
        season: ['Summer', 'Winter', 'All-season']
    };

    // Check for missing fields
    const missingFields = requiredFields.filter(field => !item[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate field values
    for (const field of ['type', 'color', 'occasion', 'season']) {
        if (validValues[field] && !validValues[field].includes(item[field])) {
            throw new Error(`Invalid ${field}: ${item[field]}. Must be one of: ${validValues[field].join(', ')}`);
        }
    }

    return true;
};

module.exports = {
    addItemToWardrobe,
    getWardrobeByUid,
    getGarmentsByFilter,
    updateGarmentUsage,
    deleteGarment,
    extractAndParseResponse,
    validateGarmentData
};
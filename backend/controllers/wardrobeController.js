const multer = require('multer');
const { analyzeImageBufferWithPrompt } = require('../models/vision');
const { 
    addItemToWardrobe, 
    getWardrobeByUid, 
    getGarmentsByFilter,
    updateGarmentUsage,
    deleteGarment 
} = require('../models/wardrobe');

const upload = multer({ storage: multer.memoryStorage() });

// Add garment with image analysis
const addGarmentWithImage = async (req, res) => {
    try {
        const { uid } = req.body;
        
        if (!uid) {
            return res.status(400).json({ 
                success: false,
                error: 'User ID is required' 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'Image file is required' 
            });
        }

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

        const imageBuffer = req.file.buffer;

        // Analyze the image with Gemini AI
        const aiResponse = await analyzeImageBufferWithPrompt(imageBuffer, question);

        // Generate unique item ID
        const itemId = `garment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Add to wardrobe (this will handle parsing and validation)
        const result = await addItemToWardrobe(uid, itemId, aiResponse);

        res.status(200).json({
            success: true,
            message: 'Garment successfully analyzed and added to wardrobe',
            data: {
                itemId: result.itemId,
                item: result.item,
                classification: {
                    type: result.item.type,
                    subcategory: result.item.subcategory,
                    color: result.item.color,
                    occasion: result.item.occasion,
                    season: result.item.season
                }
            }
        });

    } catch (error) {
        console.error('Error adding garment with image:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze image and add garment to wardrobe',
            details: error.message
        });
    }
};

// Get user's complete wardrobe
const getUserWardrobe = async (req, res) => {
    try {
        const { uid } = req.params;

        if (!uid) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const wardrobe = await getWardrobeByUid(uid);

        if (!wardrobe.exists) {
            return res.status(200).json({
                success: true,
                message: 'No wardrobe found for this user',
                data: {
                    userId: uid,
                    items: {},
                    totalItems: 0,
                    isEmpty: true
                }
            });
        }

        // Transform items object to array for easier frontend handling
        const itemsArray = wardrobe.items ? Object.values(wardrobe.items) : [];

        res.status(200).json({
            success: true,
            message: 'Wardrobe retrieved successfully',
            data: {
                userId: wardrobe.userId,
                items: wardrobe.items || {},
                itemsArray: itemsArray,
                totalItems: wardrobe.totalItems || 0,
                createdAt: wardrobe.createdAt,
                updatedAt: wardrobe.updatedAt,
                isEmpty: itemsArray.length === 0
            }
        });

    } catch (error) {
        console.error('Error fetching user wardrobe:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch wardrobe',
            details: error.message
        });
    }
};

// Get filtered garments
const getFilteredGarments = async (req, res) => {
    try {
        const { uid } = req.params;
        const filters = req.query;

        if (!uid) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        // Validate filter values
        const validFilters = {
            type: ['Top', 'Bottom', 'Dress', 'Outerwear', 'Footwear', 'Accessory'],
            color: ['Black', 'White', 'Blue', 'Red', 'Green', 'Orange', 'Yellow', 'Beige', 'Multi-color'],
            occasion: ['Casual', 'Formal', 'Party', 'Sports', 'Travel'],
            season: ['Summer', 'Winter', 'All-season']
        };

        // Validate provided filters
        for (const [key, value] of Object.entries(filters)) {
            if (validFilters[key] && !validFilters[key].includes(value)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid ${key}: ${value}. Must be one of: ${validFilters[key].join(', ')}`
                });
            }
        }

        const garments = await getGarmentsByFilter(uid, filters);

        res.status(200).json({
            success: true,
            message: `Found ${garments.length} matching garments`,
            data: {
                garments: garments,
                count: garments.length,
                appliedFilters: filters
            }
        });

    } catch (error) {
        console.error('Error fetching filtered garments:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch filtered garments',
            details: error.message
        });
    }
};

// Update garment usage (mark as worn)
const markGarmentAsWorn = async (req, res) => {
    try {
        const { uid, itemId } = req.params;

        if (!uid || !itemId) {
            return res.status(400).json({
                success: false,
                error: 'User ID and Item ID are required'
            });
        }

        await updateGarmentUsage(uid, itemId);

        res.status(200).json({
            success: true,
            message: 'Garment usage updated successfully',
            data: {
                itemId: itemId,
                action: 'marked_as_worn'
            }
        });

    } catch (error) {
        console.error('Error updating garment usage:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to update garment usage',
            details: error.message
        });
    }
};

// Delete garment from wardrobe
const removeGarment = async (req, res) => {
    try {
        const { uid, itemId } = req.params;

        if (!uid || !itemId) {
            return res.status(400).json({
                success: false,
                error: 'User ID and Item ID are required'
            });
        }

        await deleteGarment(uid, itemId);

        res.status(200).json({
            success: true,
            message: 'Garment removed from wardrobe successfully',
            data: {
                itemId: itemId,
                action: 'deleted'
            }
        });

    } catch (error) {
        console.error('Error removing garment:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to remove garment from wardrobe',
            details: error.message
        });
    }
};

// Get wardrobe statistics
const getWardrobeStats = async (req, res) => {
    try {
        const { uid } = req.params;

        if (!uid) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const wardrobe = await getWardrobeByUid(uid);

        if (!wardrobe.exists || !wardrobe.items) {
            return res.status(200).json({
                success: true,
                message: 'No wardrobe data found',
                data: {
                    totalItems: 0,
                    byType: {},
                    byColor: {},
                    byOccasion: {},
                    bySeason: {},
                    mostWorn: [],
                    neverWorn: []
                }
            });
        }

        const items = Object.values(wardrobe.items);

        // Calculate statistics
        const stats = {
            totalItems: items.length,
            byType: {},
            byColor: {},
            byOccasion: {},
            bySeason: {},
            mostWorn: [],
            neverWorn: []
        };

        // Group by categories
        items.forEach(item => {
            stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
            stats.byColor[item.color] = (stats.byColor[item.color] || 0) + 1;
            stats.byOccasion[item.occasion] = (stats.byOccasion[item.occasion] || 0) + 1;
            stats.bySeason[item.season] = (stats.bySeason[item.season] || 0) + 1;

            if (item.timesWorn === 0) {
                stats.neverWorn.push(item);
            }
        });

        // Get most worn items (top 10)
        stats.mostWorn = items
            .filter(item => item.timesWorn > 0)
            .sort((a, b) => b.timesWorn - a.timesWorn)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            message: 'Wardrobe statistics retrieved successfully',
            data: stats
        });

    } catch (error) {
        console.error('Error fetching wardrobe statistics:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch wardrobe statistics',
            details: error.message
        });
    }
};

// Manually add garment (without image)
const addGarmentManually = async (req, res) => {
    try {
        const { uid } = req.params;
        const garmentData = req.body;

        if (!uid) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        // Validate required fields
        const requiredFields = ['type', 'subcategory', 'color', 'occasion', 'season'];
        const missingFields = requiredFields.filter(field => !garmentData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Generate unique item ID
        const itemId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create mock AI response format for consistency
        const mockAiResponse = {
            response: JSON.stringify(garmentData)
        };

        const result = await addItemToWardrobe(uid, itemId, mockAiResponse);

        res.status(200).json({
            success: true,
            message: 'Garment added to wardrobe successfully',
            data: {
                itemId: result.itemId,
                item: result.item
            }
        });

    } catch (error) {
        console.error('Error adding garment manually:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to add garment to wardrobe',
            details: error.message
        });
    }
};

// Update garment details
const updateGarment = async (req, res) => {
    try {
        const { uid, itemId } = req.params;
        const updates = req.body;

        if (!uid || !itemId) {
            return res.status(400).json({
                success: false,
                error: 'User ID and Item ID are required'
            });
        }

        // Get current wardrobe to check if item exists
        const wardrobe = await getWardrobeByUid(uid);
        
        if (!wardrobe.exists || !wardrobe.items || !wardrobe.items[itemId]) {
            return res.status(404).json({
                success: false,
                error: 'Garment not found in wardrobe'
            });
        }

        // Validate update fields if provided
        const validFields = ['subcategory', 'color', 'occasion', 'season'];
        const invalidFields = Object.keys(updates).filter(field => 
            !validFields.includes(field) && field !== 'type'
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Invalid fields: ${invalidFields.join(', ')}. Allowed: ${validFields.join(', ')}`
            });
        }

        // Prepare update object
        const updateObject = {};
        Object.keys(updates).forEach(field => {
            updateObject[`items.${itemId}.${field}`] = updates[field];
        });
        updateObject[`items.${itemId}.updatedAt`] = new Date();

        // Update in Firestore
        const { db } = require('../config/firebaseAdmin');
        const WARDROBE_COLLECTION = 'wardrobes';
        
        await db.collection(WARDROBE_COLLECTION).doc(uid).update({
            ...updateObject,
            updatedAt: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Garment updated successfully',
            data: {
                itemId: itemId,
                updates: updates
            }
        });

    } catch (error) {
        console.error('Error updating garment:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to update garment',
            details: error.message
        });
    }
};

module.exports = {
    addGarmentWithImage,
    getUserWardrobe,
    getFilteredGarments,
    markGarmentAsWorn,
    removeGarment,
    getWardrobeStats,
    addGarmentManually,
    updateGarment,
    upload
};
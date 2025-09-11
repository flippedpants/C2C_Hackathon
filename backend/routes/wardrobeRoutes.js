const express = require('express');
const router = express.Router();
const { 
    addGarmentWithImage,
    getUserWardrobe,
    getFilteredGarments,
    markGarmentAsWorn,
    removeGarment,
    getWardrobeStats,
    addGarmentManually,
    updateGarment,
    upload
} = require("../controllers/wardrobeController");

// Analyze image and save result to Firestore under wardrobes/{uid}
router.post('/items/analyze/:uid', upload.single("image"), addGarmentWithImage);

// Get a user's wardrobe document
router.get('/:uid', getUserWardrobe);

// Get filtered garments for user
router.get('/:uid/items', getFilteredGarments);

// Mark a garment as worn
router.post('/:uid/items/:itemId/worn', markGarmentAsWorn);

// Delete a garment
router.delete('/:uid/items/:itemId', removeGarment);

// Get wardrobe stats
router.get('/:uid/stats', getWardrobeStats);

// Add a garment manually
router.post('/:uid/items', addGarmentManually);

// Update a garment
router.patch('/:uid/items/:itemId', updateGarment);

module.exports = router;
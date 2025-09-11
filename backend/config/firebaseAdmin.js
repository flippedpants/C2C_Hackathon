const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK using service account
// Ensure serviceAccountKey.json exists at backend/serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(require(serviceAccountPath)),
    });
}

const db = admin.firestore();

module.exports = { admin, db }; 
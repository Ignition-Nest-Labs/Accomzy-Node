var admin = require("firebase-admin");

var serviceAccount = require("./firebaseKey.json");
const { logger } = require("./logger");

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://accomzy-75b18-default-rtdb.firebaseio.com"
})

logger.info("Firebase Initialized")
module.exports = {
    firebaseAdmin
}
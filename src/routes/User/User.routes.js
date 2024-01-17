const { RegisterController, LoginController, getProfile, updateSaveProperty, getSavedProperties, updateUserProfile } = require('../../controllers/User/user.controller');
const { authMiddleware } = require('../../middlewares/Auth/auth.middleware');

const router = require('express').Router();

router.post('/Register', RegisterController)
router.post('/Login', LoginController)
router.post('/getProfile', authMiddleware, getProfile)
router.post('/updateSaveProperty', authMiddleware, updateSaveProperty)
router.post('/getSavedProperties', authMiddleware, getSavedProperties)
router.post('/updateUserProfile', authMiddleware, updateUserProfile)
module.exports = {
    UserRoutes: router,
};

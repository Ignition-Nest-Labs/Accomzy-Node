const { chatWithUser, sendMessage, getAllChatlist } = require('../../controllers/Chat/Chat.controller');
const { authMiddleware } = require('../../middlewares/Auth/auth.middleware');

const router = require('express').Router();

router.post('/chatWithUser', authMiddleware, chatWithUser)
router.post('/sendMessage', authMiddleware, sendMessage)
router.post('/getAllChatlist', authMiddleware, getAllChatlist)
module.exports = {
    ChatRoutes: router,
};

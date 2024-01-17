
const { authMiddleware } = require('../../middlewares/Auth/auth.middleware');


const router = require('express').Router();

router.post('/checkAuth', authMiddleware, (req, res) => {
    res.status(200).send({
        is_user: req.is_user,
        is_owner: req.is_owner,
    })
})


module.exports = {
    AuthRoutes: router,
};

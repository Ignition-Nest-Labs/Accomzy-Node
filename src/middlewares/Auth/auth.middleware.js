const { AuthTokenModel } = require("../../models/AuthToken/AuthToken.model");
const { UserModel } = require("../../models/User/User.Model");


exports.authMiddleware = async (req, res, next) => {
    try {
        const { token: Token, userid: UserId } = req.headers;

        if (!Token) {
            return res.status(400).json({ message: 'Token & UserId are a required field' });
        }
        const checkUserExist = await AuthTokenModel.findOne({
            where: {
                UserId: UserId,

            }
        })
        if (!checkUserExist) {
            return res.status(404).json({ message: 'User does not exist' });
        }
        const checkAuthToken = await AuthTokenModel.findOne({
            where: {
                Token: Token,
                UserId: UserId
            },
        });
        if (!checkAuthToken) {
            return res.status(403).json({ message: 'Unauthorized Session' });
        }
        if (checkAuthToken.Token !== Token) {
            return res.status(403).json({ message: 'Unauthorized Session' });
        }
        const user = await UserModel.findOne({
            where: {
                UserId: UserId,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user) {
            req.user = user;
            req.is_user = user.Explorer;
            req.is_owner = user.Owner;
            next();

        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
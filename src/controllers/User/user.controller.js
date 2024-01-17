const { AuthTokenModel } = require("../../models/AuthToken/AuthToken.model");
const { PropertiesModel } = require("../../models/Properties/Properties.Model");
const { UserModel } = require("../../models/User/User.Model");
const uniqid = require('uniqid')
const uuid = require('uuid')
const RegisterController = async (req, res) => {
    try {
        const userId = uniqid("Accomzy-")
        const { Name, PhoneNumber, Owner, Explorer } = req.body;

        // Check if both Name and PhoneNumber are present
        if (!Name || !PhoneNumber) {
            return res.status(400).json({ message: 'Name and PhoneNumber are required fields' });
        }

        // Check if the PhoneNumber already exists
        const existingUser = await UserModel.findOne({
            where: {
                PhoneNumber: PhoneNumber,
            },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Phone number already exists' });
        }

        // Ensure either Owner or Explorer is set to true
        if (!Owner && !Explorer) {
            return res.status(400).json({ message: 'Either Owner or Explorer must be true' });
        }

        // Create a new user
        const newUser = await UserModel.create({
            Name,
            UserId: userId,
            PhoneNumber,
            Owner,
            Explorer,
        });
        const Token = uuid.v4()
        const generateToken = await AuthTokenModel.create({

            UserId: userId,
            Token: Token
        })

        return res.status(200).send({
            newUser,
            Token,
            UserId: userId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const LoginController = async (req, res) => {
    try {
        const { PhoneNumber } = req.body;

        // Check if PhoneNumber is present
        if (!PhoneNumber) {
            return res.status(400).json({ message: 'PhoneNumber is a required field' });
        }

        // Check if the user with the provided PhoneNumber exists
        const user = await UserModel.findOne({
            where: {
                PhoneNumber: PhoneNumber,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found Please ! Register First' });
        }
        const Token = uuid.v4()
        await AuthTokenModel.update({


            Token: Token
        }, {
            where: {
                UserId: user.UserId
            }

        })

        // Perform additional authentication steps if needed (e.g., password verification)

        // If authentication is successful, you can respond with a success message or a token
        return res.status(200).json({ message: 'Login successful', user: user, Token, UserId: user.UserId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getProfile = async (req, res) => {
    try {
        const { UserId } = req.user
        if (!UserId) {
            return res.status(404).send({
                message: "User Id Not Defined"
            })
        }
        let userData = await UserModel.findOne({
            where: {
                UserId: UserId,

            }
        })
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userData) {
            return res.status(200).json({ userData });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateSaveProperty = async (req, res) => {
    try {
        const { UserId } = req.user
        const { PropertyId } = req.body
        if (!UserId) {
            return res.status(404).send({
                message: "User Id Not Defined"
            })
        }
        if (!PropertyId) {
            return res.status(404).send({
                message: "Property Id Not Defined"
            })
        }
        let userData = await UserModel.findOne({
            where: {
                UserId: UserId,

            }
        })
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userData) {
            let savedProperties = JSON.parse(userData.SavedProperties)

            const findProperty = savedProperties.find((property) => property.PropertyId === PropertyId)
            if (findProperty) {

                const removeProperty = savedProperties.filter((property) => property.PropertyId !== PropertyId)
                await UserModel.update({
                    SavedProperties: (removeProperty)
                }, {
                    where: {
                        UserId: UserId
                    }
                })

                return res.status(200).json({
                    message: 'Property Removed',
                    saved: false
                });
            }
            if (!findProperty) {
                savedProperties.push({
                    PropertyId: PropertyId
                })
                await UserModel.update({
                    SavedProperties: (savedProperties)
                }, {
                    where: {
                        UserId: UserId
                    }
                })
                return res.status(200).json({ message: 'Property Saved', saved: true });
            }
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


const getSavedProperties = async (req, res) => {
    try {
        const { UserId } = req.user
        if (!UserId) {
            return res.status(404).send({
                message: "User Id Not Defined"
            })
        }
        let userData = await UserModel.findOne({
            where: {
                UserId: UserId,

            }
        })
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userData) {
            let savedProperties = JSON.parse(userData.SavedProperties)
            for (let i = 0; i < savedProperties.length; i++) {
                const element = savedProperties[i];
                let propertyData = await PropertiesModel.findOne({
                    where: {
                        PropertyId: element.PropertyId
                    }
                })
                savedProperties[i] = propertyData
            }
            savedProperties.forEach((property) => {
                property.PropertyImages = JSON.parse(property.PropertyImages)
                property.Amenities = JSON.parse(property.Amenities)
                property.Reviews = JSON.parse(property.Reviews)
                property.Rules = JSON.parse(property.Rules)
                property.Meals = JSON.parse(property.Meals)
                property.Facilities = JSON.parse(property.Facilities)
            })
            return res.status(200).json(savedProperties);
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


const updateUserProfile = async (req, res) => {
    try {
        const { UserId } = req.user
        const { Name, ProfilePhoto } = req.body
        if (!UserId) {
            return res.status(404).send({
                message: "User Id Not Defined"
            })
        }
        if (!Name || !ProfilePhoto) {
            return res.status(404).send({
                message: "Name or ProfilePhoto Not Defined"
            })
        }
        let userData = await UserModel.findOne({
            where: {
                UserId: UserId,

            }
        })
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userData) {
            await UserModel.update({
                Name: Name,

                ProfilePhoto: ProfilePhoto
            }, {
                where: {
                    UserId: UserId
                }
            })
            return res.status(200).json({ message: 'Profile Updated' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { RegisterController, LoginController, getProfile, updateSaveProperty, getSavedProperties, updateUserProfile };

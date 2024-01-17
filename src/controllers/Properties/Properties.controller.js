const { PropertiesModel } = require("../../models/Properties/Properties.Model");
const { UserModel } = require("../../models/User/User.Model");
const { v4: uuidv4 } = require('uuid');
const { logger } = require("../../utils/logger");

const registerProperty = async (req, res) => {
    const propertyId = uuidv4();
    try {
        const {

            PropertyName,
            Meals,
            PropertyType,
            Area,
            ContactNumber,
            Amenities,
            PropertyImages,
            Floors,
            Rooms,
            Reviews,
            Latitude,
            Longitude,
            City,
            State,
            Landmark,
            PinCode,
            Street,
            Facilities,
            Rules,
            AdditionalNote,
            Price
        } = req.body;

        // Check if all required fields are present
        const requiredFields = ['PropertyName', 'PropertyType', 'Area', 'ContactNumber', 'Floors', 'Rooms', 'Latitude', 'Longitude', 'City', 'State', 'Landmark', 'PinCode', 'Street', 'Price'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Check if the owner is true in the user
        const ownerUser = await UserModel.findOne({
            where: {
                UserId: req.user.UserId,
                Owner: true,
            },
        });

        if (!ownerUser) {
            return res.status(403).json({ error: 'User must be an owner to register a property' });
        }

        // Additional checks for field formats
        if (!Array.isArray(PropertyImages) || PropertyImages.length < 3) {
            return res.status(400).json({ error: 'PropertyImages must be an array with at least 3 items' });
        }

        if (!Array.isArray(Amenities) || !Array.isArray(Facilities) || !Array.isArray(Rules) || !Array.isArray(Meals)) {
            return res.status(400).json({ error: 'Amenities, Facilities, and Rules and Meals must be arrays' });
        }


        // Create a new property
        const newProperty = await PropertiesModel.create({
            UserId: req.user.UserId,
            PropertyId: propertyId,
            PropertyName,
            PropertyType,
            Meals,
            Area,
            ContactNumber,
            Amenities,
            PropertyImages,
            Floors,
            Rooms,
            Reviews,
            Latitude,
            Longitude,
            City,
            State,
            Landmark,
            PinCode,
            Street,
            Facilities,
            Rules,
            AdditionalNote,
            Price
        });

        return res.status(201).json(newProperty);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getAllProperties = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.body;
        const offset = (page - 1) * pageSize;

        const properties = await PropertiesModel.findAll({
            limit: parseInt(pageSize),
            offset: parseInt(offset),
        });

        properties.forEach((property) => {
            property.PropertyImages = JSON.parse(property.PropertyImages);
            property.Amenities = JSON.parse(property.Amenities);
            property.Facilities = JSON.parse(property.Facilities);
            property.Rules = JSON.parse(property.Rules);
            property.Meals = JSON.parse(property.Meals);
        });

        return res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }





};
const getPropertyDetails = async (req, res) => {
    try {
        const { propertyId, UserId } = req.body
        if (!UserId) {
            console.log("No User Id ")

        }
        if (!propertyId) {
            return res.status(404).send({
                message: "Property Id Not Defined"
            })
        }

        let propertyData = await PropertiesModel.findOne({
            where: {
                PropertyId: propertyId,
            }
        })

        if (!propertyData) {
            return res.status(404).json({ message: 'Property not found' });
        }

        propertyData.PropertyImages = JSON.parse(propertyData.PropertyImages);
        propertyData.Amenities = JSON.parse(propertyData.Amenities);
        propertyData.Facilities = JSON.parse(propertyData.Facilities);
        propertyData.Rules = JSON.parse(propertyData.Rules);
        propertyData.Meals = JSON.parse(propertyData.Meals);
        propertyData.Reviews = JSON.parse(propertyData.Reviews);

        const ownerDetails = await UserModel.findOne({
            where: {
                UserId: propertyData.UserId
            }
        })

        const rating = propertyData.Reviews.reduce((acc, review) => acc + review.Rating, 0) / propertyData.Reviews.length;

        // Add name to review for each review
        for (const review of propertyData.Reviews) {
            const user = await UserModel.findOne({
                where: {
                    UserId: review.UserId
                }
            });
            review.Name = user.Name;
            review.ProfilePhoto = user.ProfilePhoto;
        }

        const userSavedProperties = await UserModel.findOne({
            where: {
                UserId
            }
        })

        if (!userSavedProperties) {
            console.log("User Not Found")
        }
        const save = { saved: false }
        if (userSavedProperties) {
            const savedProperties = JSON.parse(userSavedProperties.SavedProperties)

            savedProperties.filter((property) => {
                if (property.PropertyId === propertyId) {
                    save.saved = true
                }

            }
            )
        }

        return res.status(200).json({ propertyData, ownerDetails, rating, save });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


const getYourListedProperties = async (req, res) => {
    try {
        const { UserId } = req.user
        if (!UserId) {
            return res.status(404).send({
                message: "User Id Not Defined"
            })
        }
        let propertyData = await PropertiesModel.findAll({
            where: {
                UserId: UserId,

            }
        })
        if (!propertyData) {
            return res.status(404).json({ message: 'Property not found' });
        }
        if (propertyData) {
            propertyData.forEach((property) => {
                property.PropertyImages = JSON.parse(property.PropertyImages);
                property.Amenities = JSON.parse(property.Amenities);
                property.Facilities = JSON.parse(property.Facilities);
                property.Rules = JSON.parse(property.Rules);
                property.Meals = JSON.parse(property.Meals);
            });
            return res.status(200).json(propertyData);
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const PostReview = async (req, res) => {
    try {
        const { UserId } = req.user
        const { propertyId, Review, Rating } = req.body
        if (!propertyId) {
            return res.status(404).send({
                message: "Property Id Not Defined"
            })
        }
        let propertyData = await PropertiesModel.findOne({
            where: {
                PropertyId: propertyId,

            }
        })
        if (!propertyData) {
            return res.status(404).json({ message: 'Property not found' });
        }
        if (propertyData) {
            propertyData.Reviews = JSON.parse(propertyData.Reviews);


            const review = propertyData.Reviews.find((review) => review.UserId === UserId)
            if (review) {
                review.Review = Review
                review.Rating = Rating
                await PropertiesModel.update({
                    Reviews: (propertyData.Reviews)
                }, {
                    where: {
                        PropertyId: propertyId
                    }
                })
                return res.status(200).json({ message: "Your Review  Has Been Updated Successfully" });
            }

            propertyData.Reviews.push({ Review, Rating, UserId })
            await PropertiesModel.update({
                Reviews: (propertyData.Reviews)
            }, {
                where: {
                    PropertyId: propertyId
                }
            })
            return res.status(200).json({ message: "Your Review  Has Been Posted Successfully" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


const SearchProperty = async (req, res) => {
    try {


        const { SearchQuery } = req.body
        const properties = await PropertiesModel.findAll()



        properties.forEach((property) => {
            property.PropertyImages = JSON.parse(property.PropertyImages);
            property.Amenities = JSON.parse(property.Amenities);
            property.Facilities = JSON.parse(property.Facilities);
            property.Rules = JSON.parse(property.Rules);
            property.Meals = JSON.parse(property.Meals);

        });
        const finalSearchQuery = SearchQuery.toLowerCase().trim()
        const searchResult = properties.filter((property) => {
            return property.PropertyName.toLowerCase().includes(finalSearchQuery) ||
                property.PropertyType.toLowerCase().includes(finalSearchQuery)
                || property.City.toLowerCase().includes(finalSearchQuery)
                || property.State.toLowerCase().includes(finalSearchQuery)
                || property.Landmark.toLowerCase().includes(finalSearchQuery)
                || property.PinCode.toLowerCase().includes(finalSearchQuery)
                || property.Street.toLowerCase().includes(finalSearchQuery)
        })

        return res.status(200).json(searchResult);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


const getFilterOptions = async (req, res) => {
    try {
        const { Lat, Long } = req.body

        //first get all common amenities
        const amenities = []
        const facilities = []
        const properties = await PropertiesModel.findAll()

        await properties.forEach((property) => {
            property.PropertyImages = JSON.parse(property.PropertyImages);
            property.Amenities = JSON.parse(property.Amenities);
            property.Facilities = JSON.parse(property.Facilities);
            property.Rules = JSON.parse(property.Rules);
            property.Meals = JSON.parse(property.Meals);
            property.Reviews = JSON.parse(property.Reviews);
            for (const amenity of property.Amenities) {
                for (const amenity1 of property.Amenities) {
                    if (amenity.name === amenity1.name) {
                        null
                    }
                    else {
                        amenities.push(amenity)
                    }
                }
            }
            for (const facility of property.Facilities) {
                for (const facility1 of property.Facilities) {
                    if (facility.name === facility1.name) {
                        null
                    }
                    else {
                        facilities.push(facility)
                    }
                }
            }



            // Create a new array with unique items


        }
        )
        const finalAmenities = {};
        const finalAmenitiesArray = amenities.filter(item => {
            const key = `${item.name}`;
            if (!finalAmenities[key]) {
                finalAmenities[key] = true;
                return true;
            }
            return false;
        });

        const finalFacilities = {}
        const finalFacilitiesArray = facilities.filter(item => {
            const key = `${item.name}`;
            if (!finalFacilities[key]) {
                finalFacilities[key] = true;
                return true;
            }
            return false;
        });


        const maxPrice = Math.max.apply(Math, properties.map(function (o) { return o.Price; }))
        const minPrice = Math.min.apply(Math, properties.map(function (o) { return o.Price; }))



        return res.status(200).json({ Facilities: finalFacilitiesArray, Amenities: finalAmenitiesArray, maxPrice, minPrice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getFilteredProperties = async (req, res) => {
    const { minPrice, maxPrice, amenities } = req.body;
    try {
        const properties = await PropertiesModel.findAll({
            where: {
                Price: {
                    [Op.between]: [minPrice, maxPrice]
                }
            }
        });

        const filterWithAmenities = properties.filter((property) => {
            const propertyAmenities = JSON.parse(property.Amenities);
            return propertyAmenities.some((amenity) => amenities.includes(amenity.name));
        });

        return res.status(200).json(filterWithAmenities);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    registerProperty,
    getAllProperties,
    getPropertyDetails,
    getYourListedProperties,
    PostReview,
    SearchProperty,
    getFilterOptions,
    getFilteredProperties
};
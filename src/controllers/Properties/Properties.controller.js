const { PropertiesModel } = require("../../models/Properties/Properties.Model");
const { UserModel } = require("../../models/User/User.Model");
const { v4: uuidv4 } = require('uuid');
const { logger } = require("../../utils/logger");
const axios = require('axios');
const upiGatewayKey = "a7745452-e4fc-4501-8ffb-8e4151a2156c"

const registerProperty = async (req, res) => {
    const propertyId = uuidv4();
    const PaymentOrderId = uuidv4();
    try {
        const {
            Occupancies,
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
            Price,
            InstituteNearBy,
            Gender,
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
        if (!Array.isArray(PropertyImages) || PropertyImages.length < 5) {
            return res.status(400).json({ message: 'At-least 5 Property Images are required ' });
        }

        if (!Array.isArray(Amenities) || !Array.isArray(Facilities) || !Array.isArray(Rules) || !Array.isArray(Meals)) {
            return res.status(400).json({ message: 'Amenities, Facilities, and Rules and Meals must be arrays' });
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
            Price,
            InstituteNearBy,
            Gender,
            Occupancies,
            Approved: false,
            PaymentOrderId,
            PaymentApproved: false
        });

        var data = JSON.stringify({
            "key": upiGatewayKey,
            "client_txn_id": PaymentOrderId,
            "amount": "99",
            "p_info": "Accomzy Property Approval",
            "customer_name": ownerUser.Name,
            "customer_email": "support@accomzy.in",
            "customer_mobile": ownerUser.PhoneNumber,
            "redirect_url": "https://api.accomzy.in/Property/checkPaymentStatus",
            "udf1": "user defined field 1",
            "udf2": "user defined field 2",
            "udf3": "user defined field 3"
        });

        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.ekqr.in/api/create_order',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios(config)


        return res.status(201).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getAllProperties = async (req, res) => {
    try {
        const { facilities,
            amenities,
            minPrice,
            maxPrice,
            latitude,
            longitude,
            city,
            institute,
            searchQuery,
            type,
            Occupancies
        } = req.body;





        const filterByFacilities = async (properties) => {
            const filteredProperties = [];
            if (facilities !== undefined && facilities.length > 0) {
                const facilitiesToCheck = facilities.map((facility) => facility.name);
                for (const property of properties) {
                    const propertyFacilities = (property.Facilities);
                    const propertyFacilitiesNames = propertyFacilities.map((facility) => facility.name);

                    if (facilitiesToCheck.every((facility) => propertyFacilitiesNames.includes(facility))) {

                        filteredProperties.push(property);
                    }
                }
                return filteredProperties

            }
            else {
                return properties
            }
        }


        const filterByAmenities = async (properties) => {
            const filteredProperties = [];

            if (amenities !== undefined && amenities.length > 0) {
                const amenitiesToCheck = amenities.map((amenity) => amenity.name);
                for (const property of properties) {
                    const propertyAmenities = (property.Amenities);
                    const propertyAmenitiesNames = propertyAmenities.map((amenity) => amenity.name);

                    if (amenitiesToCheck.every((amenity) => propertyAmenitiesNames.includes(amenity))) {

                        filteredProperties.push(property);
                    }
                }
                return filteredProperties

            }
            else {
                return properties
            }

        }

        const filterByPrice = async (properties) => {


            const filteredProperties = [];
            if (minPrice !== undefined) {
                console.log("Min Price is defined")
                console.log(minPrice)
                for (const property of properties) {
                    if ((property.Price) >= parseInt(minPrice) && property.Price <= parseInt(maxPrice)) {
                        filteredProperties.push(property);
                    }
                }
                return filteredProperties
            }
            else {
                return properties
            }
        }


        const sortByDistance = async (properties) => {
            if (latitude !== undefined && longitude !== undefined) {
                const sortedProperties = properties.sort((a, b) => {
                    const distanceA = Math.sqrt(Math.pow(a.Latitude - latitude, 2) + Math.pow(a.Longitude - longitude, 2));
                    const distanceB = Math.sqrt(Math.pow(b.Latitude - latitude, 2) + Math.pow(b.Longitude - longitude, 2));
                    return distanceA - distanceB;
                });
                return sortedProperties;
            }
            else {
                return properties
            }
        }

        const filterByCity = async (properties) => {
            console.log("City is defined")
            console.log(city)
            const filteredProperties = [];
            if (city !== undefined) {
                logger.info("City is defined")
                logger.info(city)

                for (const property of properties) {
                    if ((property.City).toLowerCase() === (city).toLowerCase()) {
                        filteredProperties.push(property);
                        console.log("Found Property In " + city + " " + property.PropertyName)
                    }

                }
                return filteredProperties
            }
            else {
                return properties
            }
        }


        const filterByInstitute = async (properties) => {
            console.log("Institute is defined")
            console.log(institute)
            const filteredProperties = [];
            if (institute !== undefined) {
                for (const property of properties) {
                    if ((property.InstituteNearBy).toLowerCase() === (institute).toLowerCase()) {
                        filteredProperties.push(property);
                    }
                }
                return filteredProperties
            }
            else {
                return properties
            }
        }

        const filterBySearchQuery = async (properties) => {
            console.log("Search Query is defined")
            console.log(searchQuery)
            const filteredProperties = [];
            if (searchQuery !== undefined) {
                for (const property of properties) {
                    searchQuery.toLowerCase().replace(/\s/g, '')
                    if ((property.PropertyName).toLowerCase().includes((searchQuery).toLowerCase()) ||
                        (property.PropertyType).toLowerCase().includes((searchQuery).toLowerCase()) ||
                        (property.City).toLowerCase().includes((searchQuery).toLowerCase()) ||
                        (property.State).toLowerCase().includes((searchQuery).toLowerCase()) ||
                        (property.Landmark).toLowerCase().includes((searchQuery).toLowerCase()) ||
                        (property.PinCode).toLowerCase().includes((searchQuery).toLowerCase()) ||
                        (property.Street).toLowerCase().includes((searchQuery).toLowerCase())) {
                        filteredProperties.push(property);
                    }
                }
                return filteredProperties
            }
            else {
                return properties
            }
        }

        const filterByType = async (properties) => {
            console.log("Type is defined")
            console.log(type)
            const filteredProperties = [];
            if (type !== undefined) {
                for (const property of properties) {
                    if (((property.PropertyType).toLowerCase().replace(/\s/g, '')) === ((type).toLowerCase().replace(/\s/g, ''))
                    ) {
                        filteredProperties.push(property);
                    }
                }
                return filteredProperties
            }
            else {
                return properties
            }
        }



        const properties = await PropertiesModel.findAll({
            where: {
                Approved: true,
            }
        });

        await properties.forEach((property) => {
            property.PropertyImages = JSON.parse(property.PropertyImages);
            property.Amenities = JSON.parse(property.Amenities);
            property.Facilities = JSON.parse(property.Facilities);
            property.Rules = JSON.parse(property.Rules);
            property.Meals = JSON.parse(property.Meals);
        });



        const propertyFilteredByAmenities = await filterByAmenities(properties)
        const propertyFilteredByFacilities = await filterByFacilities(propertyFilteredByAmenities)
        const propertyFilteredByPrice = await filterByPrice(propertyFilteredByFacilities)
        const propertyFilteredByDistance = await sortByDistance(propertyFilteredByPrice)
        const propertyFilteredByCity = await filterByCity(propertyFilteredByDistance)
        const propertyFilteredByInstitute = await filterByInstitute(propertyFilteredByCity)
        const propertyFilteredBySearchQuery = await filterBySearchQuery(propertyFilteredByInstitute)
        const propertyFilteredByType = await filterByType(propertyFilteredBySearchQuery)
        return res.status(200).json(propertyFilteredByType);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
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


const checkPaymentStatus = async (req, res) => {

    const { client_txn_id: PaymentOrderId } = req.query
    const checkIfPaymentOrderExists = await PropertiesModel.findOne({
        where: {
            PaymentOrderId
        }
    })
    if (!checkIfPaymentOrderExists) {
        return res.status(404).send({
            message: "Order Id For This Property Was Not Found"
        })
    }
    if (checkIfPaymentOrderExists) {
        const checkForAlreadyPaid = checkIfPaymentOrderExists.PaymentApproved
        if (checkForAlreadyPaid) {
            return res.status(409).send({
                message: "Payment For This Property Has Already Been Approved"
            })
        }

        function formatDate(timestampStr) {
            // Split the timestamp into date and time parts
            const timestamp = new Date(timestampStr);
            const day = ("0" + timestamp.getDate()).slice(-2);
            const month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
            const year = timestamp.getFullYear();
            return `${day}-${month}-${year}`;
        }

        var data = JSON.stringify({
            key: upiGatewayKey,
            client_txn_id: checkIfPaymentOrderExists.PaymentOrderId,
            txn_date: formatDate(checkIfPaymentOrderExists.createdAt)
        });
        console.log(data)

        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.ekqr.in/api/check_order_status',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };



        const response = await axios(config)

        const paymentStatus = response.data.data.status == "success" ? true : false
        if (paymentStatus) {
            await PropertiesModel.update({
                PaymentApproved: true
            }, {
                where: {
                    PaymentOrderId
                }
            })
            return res.status(200).redirect('https://accomzy.in/Owner/Profile')
        }
        else {
            return res.status(409).redirect('http://accomzy.in/property-approval-failed')
        }

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
        const cities = []
        const instituteNearBy = []
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
            cities.push(property.City)
            instituteNearBy.push(property.InstituteNearBy)



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

        const finalCities = {}
        const finalCitiesArray = cities.filter(item => {
            const key = `${item}`;
            if (!finalCities[key]) {
                finalCities[key] = true;
                return true;
            }
            return false;
        });

        const finalInstituteNearBy = {}
        const finalInstituteNearByArray = instituteNearBy.filter(item => {
            const key = `${item}`;
            if (!finalInstituteNearBy[key]) {
                finalInstituteNearBy[key] = true;
                return true;
            }
            return false;
        });

        const maxPrice = Math.max.apply(Math, properties.map(function (o) { return o.Price; }))
        const minPrice = Math.min.apply(Math, properties.map(function (o) { return o.Price; }))



        return res.status(200).json({ Facilities: finalFacilitiesArray, Amenities: finalAmenitiesArray, maxPrice, minPrice, Cities: finalCitiesArray, Institutes: finalInstituteNearByArray });
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


const getNotApprovedProperties = async (req, res) => {
    try {

        let propertyData = await PropertiesModel.findAll({
            where: {

                Approved: false
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


const approveProperty = async (req, res) => {
    try {
        const { propertyId } = req.body
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
            await PropertiesModel.update({
                Approved: true
            }, {
                where: {
                    PropertyId: propertyId
                }
            })
            return res.status(200).json({ message: "Property Approved Successfully" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


const ownerDeleteProperty = async (req, res) => {
    try {
        const { propertyId } = req.body
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
            await PropertiesModel.destroy({
                where: {
                    PropertyId: propertyId
                }
            })
            return res.status(200).json({ message: "Property Deleted Successfully" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
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
    getFilteredProperties,
    getNotApprovedProperties,
    approveProperty,
    checkPaymentStatus
};

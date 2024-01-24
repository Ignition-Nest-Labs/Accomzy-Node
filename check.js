function generateRandomJsons() {
    const jsons = [];

    for (let i = 1; i <= 200; i++) {
        const propertyType = getRandomPropertyType();
        const city = getRandomCity();
        const keyword = getRandomKeyword(propertyType);

        const json = {
            PropertyName: `${propertyType} in ${city} ${i}`,
            Meals: generateRandomMeals(),
            PropertyType: propertyType,
            Area: getRandomNumber(800, 2500),
            ContactNumber: getRandomPhoneNumber(),
            Amenities: generateRandomAmenities(),
            PropertyImages: generateRandomImages(keyword),
            Floors: getRandomNumber(1, 10),
            Rooms: getRandomNumber(1, 6),
            Reviews: [],
            Latitude: getRandomLatitude(),
            Longitude: getRandomLongitude(),
            City: city,
            State: getRandomState(),
            Landmark: getRandomLandmark(),
            PinCode: getRandomPinCode(),
            Street: getRandomStreet(),
            Facilities: generateRandomFacilities(),
            Rules: generateRandomRules(),
            AdditionalNote: `This is a sample property for testing purposes ${i}`,
            Price: getRandomNumber(800, 5000).toString(),
        };

        jsons.push(json);
    }

    return jsons;
}

function getRandomPropertyType() {
    const propertyTypes = ['Apartment', 'House', 'Cabin', 'Villa', 'Penthouse', 'Chalet', "Bungalow", "   Castle", "   Dorm", "   Farmhouse", "   Guesthouse", "   Hostel", "   Hotel", "   Hotel suite", "   Houseboat", "   Hut", "   Inn", "   Loft", "   Resort", "   Townhouse", "   Villa"];
    return getRandomFromArray(propertyTypes);
}

function getRandomCity() {
    const cities = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Ahmedabad", "Pune", "Surat", "Jaipur", "Kanpur", "Lucknow", "Nagpur", "Patna", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Vadodara", "Firozabad", "Ludhiana", "Rajkot", "Agra", "Siliguri", "Nashik", "Faridabad", "Patiala", "Meerut", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar", "Dhanbad", "Jodhpur", "Amritsar", "Raipur", "Allahabad", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Madurai", "Guwahati", "Chandigarh", "Hubli-Dharwad", "Amroha", "Moradabad", "Gurgaon", "Aligarh", "Solapur", "Ranchi", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem", "Warangal", "Mira-Bhayandar", "Thiruvananthapuram", "Bhiwandi", "Saharanpur", "Guntur", "Amravati", "Bikaner", "Noida", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi", "Nellore", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded", "Kolhapur", "Ajmer", "Akola", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi", "Ulhasnagar", "Jammu", "Sangli-Miraj", "Mangalore", "Erode", "Belgaum", "Kurnool", "Ambattur", "Rajahmundry", "Tirunelveli", "Malegaon", "Gaya", "Tirupur", "Davanagere", "Kozhikode", "Akola", "Kurnool", "Bokaro", "Rajahmundry", "Ballari", "Agartala", "Bhagalpur", "Latur", "Dhule", "Korba", "Bhilwara", "Brahmapur", "Mysore", "Muzaffarpur", "Ahmednagar", "Kollam", "Raghun"]
    return getRandomFromArray(cities);
}

function getRandomKeyword(propertyType) {
    const keywords = {
        Apartment: 'urban',
        House: 'home',
        Cabin: 'cozy',
        Villa: 'luxury',
        Penthouse: 'modern',
        Chalet: 'mountain',
    };
    return keywords[propertyType];
}

function generateRandomMeals() {
    const meals = ['Breakfast', 'Lunch', 'Dinner'];
    const randomMeals = [];
    for (let i = 0; i < getRandomNumber(1, 3); i++) {
        const randomMeal = { id: i + 1, name: getRandomFromArray(meals) };
        randomMeals.push(randomMeal);
    }
    return randomMeals;
}

function generateRandomAmenities() {
    const amenities = ['City View', 'Garden', 'Swimming Pool', 'Fireplace', 'Mountain View', 'Private Beach'];
    return generateRandomItems(amenities);
}

function generateRandomFacilities() {
    const facilities = ['Wi-Fi', 'Parking', 'Pet-Friendly', 'Gym', 'Hot Tub', 'Fitness Center'];
    return generateRandomItems(facilities);
}

function generateRandomRules() {
    const rules = ['No Smoking Indoors', 'No Pets', 'Quiet Hours after 10 PM', 'Check-in after 3 PM', 'No Loud Music'];
    return generateRandomItems(rules);
}

function generateRandomItems(array) {
    const randomItems = [];
    for (let i = 0; i < getRandomNumber(1, array.length); i++) {
        const randomItem = { id: i + 1, name: getRandomFromArray(array) };
        randomItems.push(randomItem);
    }
    return randomItems;
}

function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPhoneNumber() {
    const prefix = ['123', '456', '789'];
    return `${getRandomFromArray(prefix)}-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`;
} function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomLatitude() {
    // Set the range for Indian latitudes (approximately)
    return getRandomNumber(8, 38).toFixed(4);
}

function getRandomLongitude() {
    // Set the range for Indian longitudes (approximately)
    return getRandomNumber(68, 98).toFixed(4);
}
function getRandomState() {
    const states = ['CA', 'NY', 'FL', 'TX', 'CO', 'IL', 'WA', 'TN', 'MA', 'DC'];
    return getRandomFromArray(states);
}

function getRandomLandmark() {
    const landmarks = ['Central Park', 'Hollywood Walk of Fame', 'South Beach', 'Golden Gate Bridge', 'Rocky Mountains', 'National Mall', 'Space Needle', 'Broadway', 'Fenway Park', 'The Alamo'];
    return getRandomFromArray(landmarks);
}

function getRandomPinCode() {
    return getRandomNumber(10000, 99999).toString();
}

function getRandomStreet() {
    const streetNames = ['Main', 'Maple', 'Oak', 'Cedar', 'Pine', 'Birch', 'Elm', 'Willow', 'Aspen', 'Juniper'];
    const suffixes = ['Street', 'Avenue', 'Lane', 'Drive', 'Boulevard', 'Place', 'Circle', 'Court', 'Way', 'Terrace'];
    return `${getRandomFromArray(streetNames)} ${getRandomFromArray(suffixes)}`;
}

function generateRandomImages(keyword) {
    return [
        `https://loremflickr.com/640/480/${keyword}`,
        `https://loremflickr.com/640/480/${keyword}`,
        `https://loremflickr.com/640/480/${keyword}`
    ];
}

// Example usage:

const axios = require('axios');


async function performPostRequests(json) {
    try {
        const data = JSON.stringify(json);

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:4000/Property/RegisterProperty', // Replace with the correct URL
            headers: {
                'Token': '8f7a7bef-4c42-4221-a96b-81b08ed95e62',
                'UserId': 'Accomzy-62uj47qlrr8ucy9',
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.log(error);
    }
}

const generatedJsons = generateRandomJsons();

async function sendRequests() {
    for (let i = 0; i < generatedJsons.length; i++) {
        console.log(`Sending request for JSON ${i + 1}`);
        await performPostRequests(generatedJsons[i]);
    }
}

sendRequests();


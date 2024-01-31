const { getAllInstitutes, validateInstitute } = require('../../controllers/Properties/Institiues.controller');
const { registerProperty, getAllProperties, getPropertyDetails, getYourListedProperties, PostReview, SearchProperty, getFilterOptions, getFilteredProperties, getNotApprovedProperties, approveProperty } = require('../../controllers/Properties/Properties.controller');
const { authMiddleware } = require('../../middlewares/Auth/auth.middleware');


const router = require('express').Router();

router.post('/RegisterProperty', authMiddleware, registerProperty)
router.post('/getAllProperties', getAllProperties)
router.post('/getPropertyDetails', getPropertyDetails)
router.post('/getYourListedProperties', authMiddleware, getYourListedProperties)
router.post('/PostReview', authMiddleware, PostReview)
router.post('/getFilterOptions', getFilterOptions)
router.post('/getFilteredProperties', getFilteredProperties)
router.post('/SearchProperty', SearchProperty)
router.post('/getNotApprovedProperties', getNotApprovedProperties)
router.post('/approveProperty', approveProperty)
router.post('/getAllInstitutes', getAllInstitutes)
router.post('/validateInstitute', validateInstitute)

module.exports = {
    PropertyRoutes: router,
};

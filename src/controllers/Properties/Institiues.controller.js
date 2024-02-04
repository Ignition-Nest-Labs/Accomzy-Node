const { PropertiesModel } = require("../../models/Properties/Properties.Model");
const { UserModel } = require("../../models/User/User.Model");
const { v4: uuidv4 } = require('uuid');
const { logger } = require("../../utils/logger");
const { InstitutesModel } = require("../../models/Institutes/Institutes.Model");
const { Op } = require('sequelize');

exports.getAllInstitutes = async (req, res) => {
    try {
        // Extract pagination and search parameters from the request query
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const {searchQuery} = req.body || '';

        // Calculate the offset based on page and pageSize
        const offset = (page - 1) * pageSize;

        // Fetch institutes with pagination and search
        const institutes = await InstitutesModel.findAll({
            where: {
                InstituteName: {
                    [Op.like]: `%${searchQuery}%`,
                },
            },
            offset,
            limit: pageSize,
        });

        res.status(200).json({ institutes });
    } catch (error) {
        logger.error(`[getAllInstitutes]: Failed to fetch institutes: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


exports.validateInstitute = async (req, res, next) => {
    try {
        const { InstituteName } = req.body;
        const institute = await InstitutesModel.findOne({
            where: {
                InstituteName: InstituteName
            }
        });
        if (!institute) {
            return res.status(400).json({ error: "Institute does not exist" });
        }
        if (institute) {
            return res.status(200).json({ message: "Institute exists" });
        }
    } catch (error) {
        logger.error(`[validateInstitute]: Failed to validate institute: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
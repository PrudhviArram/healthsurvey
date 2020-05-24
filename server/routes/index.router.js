const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/saveDemographicDetails',ctrlUser.saveDemographicDetails);
router.get('/findDemographic',ctrlUser.findDemographic);
router.post('/savePainScale',ctrlUser.savePainScale);
router.get('/findForm',ctrlUser.findForm);
router.get('/getCount',ctrlUser.getCount);
router.get('/getAllUsers',ctrlUser.getAllUsers);
router.get('/getAllDemographic',ctrlUser.getAllDemographic);
router.get('/getAllSurvey',ctrlUser.getAllSurvey);
router.post('/addStrories',ctrlUser.addStrories);
router.get('/getMemories',ctrlUser.getMemories);
router.post('/saveFile',ctrlUser.upload);
router.post('/submitFeedback',ctrlUser.submitFeedback);

module.exports = router;




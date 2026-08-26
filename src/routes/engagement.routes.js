const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();
router.use('/tmf-api/communicationManagement/v1', proxy(services.engagement));

module.exports = router;

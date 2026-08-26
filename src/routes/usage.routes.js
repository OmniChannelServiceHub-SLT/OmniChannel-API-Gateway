const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();
router.use('/tmf-api/usageManagement/v1', proxy(services.usage));

module.exports = router;

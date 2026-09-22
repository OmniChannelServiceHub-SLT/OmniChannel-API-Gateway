const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();
router.use('/internal-api/reporting/v4', proxy(services.reporting));

module.exports = router;

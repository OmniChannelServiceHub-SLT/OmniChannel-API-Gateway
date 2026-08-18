const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();

// Public platform health endpoint only.
router.use('/internal-api/platform/v1/health', proxy(services.platform));

module.exports = router;

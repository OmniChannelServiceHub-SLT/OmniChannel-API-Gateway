const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();
router.use('/internal-api/sales/v1', proxy(services.sales));

module.exports = router;

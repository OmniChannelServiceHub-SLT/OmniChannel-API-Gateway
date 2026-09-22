const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();
const billingProxy = proxy(services.billing);

// TMF678 Customer Bill Management
router.use('/tmf-api/customerBillManagement/v4', billingProxy);

// TMF676 Payment Management
router.use('/tmf-api/paymentManagement/v4', billingProxy);

module.exports = router;

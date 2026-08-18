const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();
const customerProxy = proxy(services.customer);

// TMF629 Customer Management
router.use('/tmf-api/customerManagement/v4', customerProxy);

// TMF632 Party Management
router.use('/tmf-api/partyManagement/v4', customerProxy);

// TMF666 Account Management
router.use('/tmf-api/accountManagement/v4', customerProxy);

module.exports = router;

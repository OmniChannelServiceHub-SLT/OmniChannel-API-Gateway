const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();
router.use('/tmf-api/productOrderingManagement/v4', proxy(services.ordering));
router.use('/tmf-api/productOfferingQualification/v4', proxy(services.ordering));
router.use('/tmf-api/shoppingCart/v4', proxy(services.ordering));

module.exports = router;

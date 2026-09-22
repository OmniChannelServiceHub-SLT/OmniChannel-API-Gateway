const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();
const productProxy = proxy(services.product);

// TMF620 Product Catalog Management
router.use('/tmf-api/productCatalogManagement/v4', productProxy);

// TMF637 Product Inventory Management
router.use('/tmf-api/productInventoryManagement/v4', productProxy);

module.exports = router;

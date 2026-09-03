const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();

const customerProxy = proxy(services.customer);

// TMF629
router.use(
  '/tmf-api/customerManagement/v1',
  customerProxy
);

// TMF632 - ADD THIS
router.use(
  '/tmf-api/party/v4',
  customerProxy
);

// Existing old route, keep if needed
//Tharini uses this
router.use(
  '/tmf-api/partyManagement/v4',
  customerProxy
);

// TMF666
router.use(
  '/tmf-api/accountManagement/v4',
  customerProxy
);

module.exports = router;
const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();

// createTroubleTicket + listTroubleTicket
router.use(
  '/tmf-api/troubleTicket/v4',
  proxy(services.engagement)
);

// createServiceRequest
router.use(
  '/api/serviceRequests',
  proxy(services.engagement)
);

// NotificationDetails
router.use(
  '/api/SystemMonitor/NotificationDetails',
  proxy(services.engagement)
);

// Keep the existing route for future communication APIs.
router.use(
  '/tmf-api/communicationManagement/v4',
  proxy(services.engagement)
);

module.exports = router;
const express = require('express');
const proxy = require('../middleware/proxyFactory');
const services = require('../config/services');

const router = express.Router();
const iamProxy = proxy(services.iam);

// Public IAM endpoints. Add further public auth endpoints here only when required.
router.use('/internal-api/iam/v1/auth/login', iamProxy);
router.use('/internal-api/iam/v1/auth/refresh', iamProxy);
router.use('/internal-api/iam/v1/auth/register', iamProxy);
router.use('/internal-api/iam/v1/auth/verify-otp', iamProxy);

module.exports = router;

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const requestId = require('./middleware/requestId.middleware');
const rateLimiter = require('./middleware/rateLimit.middleware');
const authGuard = require('./middleware/auth.middleware');
const errorHandler = require('./middleware/error.middleware');

const iamRoutes = require('./routes/iam.routes');
const iamProtectedRoutes = require('./routes/iam.protected.routes');
const platformRoutes = require('./routes/platform.routes');
const platformProtectedRoutes = require('./routes/platform.protected.routes');

const customerRoutes = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');
const orderingRoutes = require('./routes/ordering.routes');
const usageRoutes = require('./routes/usage.routes');
const billingRoutes = require('./routes/billing.routes');
const engagementRoutes = require('./routes/engagement.routes');
const salesRoutes = require('./routes/sales.routes');
const reportingRoutes = require('./routes/reporting.routes');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN === '*' ? '*' : process.env.CORS_ORIGIN,
  credentials: process.env.CORS_ORIGIN !== '*',
}));
app.use(morgan('combined'));
app.use(requestId);
app.use(rateLimiter);

// Gateway's own health endpoint.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'omnichannel-api-gateway',
    port: Number(process.env.PORT || 8080),
    correlationId: req.correlationId,
  });
});

// Public routes: login, refresh and platform health ONLY.
app.use(iamRoutes);
app.use(platformRoutes);

// All remaining service routes require a valid JWT.
app.use(authGuard);

app.use(iamProtectedRoutes);
app.use(platformProtectedRoutes);
app.use(customerRoutes);
app.use(productRoutes);
app.use(orderingRoutes);
app.use(usageRoutes);
app.use(billingRoutes);
app.use(engagementRoutes);
app.use(salesRoutes);
app.use(reportingRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `No gateway route matches ${req.method} ${req.originalUrl}`,
      correlationId: req.correlationId,
    },
  });
});

app.use(errorHandler);

module.exports = app;

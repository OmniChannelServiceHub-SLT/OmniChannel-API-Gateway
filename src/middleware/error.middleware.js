// src/middleware/error.middleware.js
// Normalizes any error surfaced during routing/proxying into a consistent
// envelope before it reaches the client.
module.exports = function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(`[${req.correlationId}]`, err.stack || err.message);

  const status = err.status || 502;
  res.status(status).json({
    error: {
      code: err.code || 'GATEWAY_ERROR',
      message: err.message || 'An unexpected gateway error occurred.',
      correlationId: req.correlationId,
    },
  });
};

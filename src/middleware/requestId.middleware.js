// src/middleware/requestId.middleware.js
// Generates or propagates an x-correlation-id header on every request so a
// single client call can be traced across the Gateway and every downstream
// service it touches.
const { v4: uuidv4 } = require('uuid');

module.exports = function requestId(req, res, next) {
  const incoming = req.headers['x-correlation-id'];
  const correlationId = incoming || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
};

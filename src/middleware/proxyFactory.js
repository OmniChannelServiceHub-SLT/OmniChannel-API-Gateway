const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function createServiceProxy(target) {
  if (!target) {
    throw new Error('Missing downstream service URL.');
  }

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    xfwd: true,
    proxyTimeout: Number(process.env.PROXY_TIMEOUT_MS || 10000),
    timeout: Number(process.env.PROXY_TIMEOUT_MS || 10000),

    // Express removes the mounted prefix from req.url.
    // Restore the original Gateway URL so TMF-aligned downstream routes
    // receive the same /tmf-api/... path.
    pathRewrite: (path, req) => req.originalUrl,

    onProxyReq: (proxyReq, req) => {
      if (req.correlationId) {
        proxyReq.setHeader('x-correlation-id', req.correlationId);
      }

      // Only forward identity headers that were set by the Gateway JWT guard.
      // Never trust client-supplied x-user-* headers.
      if (req.gatewayUser) {
        proxyReq.setHeader('x-user-id', String(req.gatewayUser.sub || ''));
        proxyReq.setHeader(
          'x-user-roles',
          Array.isArray(req.gatewayUser.roles)
            ? req.gatewayUser.roles.join(',')
            : ''
        );
        if (req.gatewayUser.scope) {
          proxyReq.setHeader('x-user-scope', String(req.gatewayUser.scope));
        }
      }

      proxyReq.setHeader('x-gateway', 'omnichannel-api-gateway');
    },

    onError: (err, req, res) => {
      console.error(`[${req.correlationId || 'no-correlation-id'}] Proxy error -> ${target}: ${err.message}`);

      if (!res.headersSent) {
        res.status(502).json({
          error: {
            code: 'UPSTREAM_UNAVAILABLE',
            message: 'Downstream service is unavailable.',
            correlationId: req.correlationId,
          },
        });
      }
    },
  });
};

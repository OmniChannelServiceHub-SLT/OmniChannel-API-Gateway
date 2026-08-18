// server.js
const app = require('./src/app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`OmniChannel API Gateway listening on port ${PORT}`);
});

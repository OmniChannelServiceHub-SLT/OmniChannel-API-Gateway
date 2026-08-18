require('dotenv').config();

module.exports = {
  iam: process.env.IAM_SERVICE_URL,
  customer: process.env.CUSTOMER_SERVICE_URL,
  engagement: process.env.ENGAGEMENT_SERVICE_URL,
  platform: process.env.PLATFORM_SERVICE_URL,
  product: process.env.PRODUCT_SERVICE_URL,
  billing: process.env.BILLING_SERVICE_URL,
  sales: process.env.SALES_SERVICE_URL,
  usage: process.env.USAGE_SERVICE_URL,
  ordering: process.env.ORDERING_SERVICE_URL,
  reporting: process.env.REPORTING_SERVICE_URL,
};

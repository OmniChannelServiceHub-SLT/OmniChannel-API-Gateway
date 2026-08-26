require('dotenv').config();

module.exports = {
  iam: process.env.IAM_SERVICE_URL,    // Identity and Access Management-3001
  customer: process.env.CUSTOMER_SERVICE_URL,  // Customer & account Management service-3002
  engagement: process.env.ENGAGEMENT_SERVICE_URL,  //customer engagement service-3003
  platform: process.env.PLATFORM_SERVICE_URL, // Platform  ,health & document service-3004
  product: process.env.PRODUCT_SERVICE_URL,  // Product Catalog & inventory Management-3005
  billing: process.env.BILLING_SERVICE_URL, // Billing & Payment Management-3006
  sales: process.env.SALES_SERVICE_URL,  //new connection & sales management-3007
  usage: process.env.USAGE_SERVICE_URL,  // Usage Management service-3008
  ordering: process.env.ORDERING_SERVICE_URL,  //product ordering service-3009
  reporting: process.env.REPORTING_SERVICE_URL, //reporting  & dashboard aggregationservice-3010
};

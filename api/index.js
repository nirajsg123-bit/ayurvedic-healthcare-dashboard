// Vercel serverless handler — wraps the Express app.
// Data is generated in-memory (see data/*.js), so no persistent DB is needed.
const app = require('../server');

module.exports = app;

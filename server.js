const express = require('express');
const router = require('./routes/index.js');
const app = express();
app.use(router);
const PORT = process.env.PORT || 5000;
app.listen(PORT)

const express = require('express')

require('dotenv').config();

const database = require("./config/database")
const routesApiVer1 = require('./api/v1/router/index.router')

database.connect();

const app = express();
const port = process.env.PORT;

//API routes
routesApiVer1(app);

app.listen(port, () => {
    console.log(`example app listen on port ${port}`);
});
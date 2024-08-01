const express = require('express')

require('dotenv').config();

const database = require("./config/database")
const routesApiVer1 = require('./api/v1/router/index.router')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors');

database.connect();

const app = express();
const port = process.env.PORT;

//parse application/json
app.use(bodyParser.json());

// Cors
app.use(cors());

app.use(cookieParser());

//API routes
routesApiVer1(app);

app.listen(port, () => {
    console.log(`example app listen on port ${port}`);
});
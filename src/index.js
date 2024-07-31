const express = require("express");
const cors = require("cors");
port = process.env.PORT || 3000;
const { error } = require("console");
const path = require("path");
const connection = require("../models/connection");

//---------------Routings---------------

const login = require("../routers/login");
const posts = require("../routers/posts");

//------------app use ---------------
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//--------giving static path of files , images stored
const staticFiles = path.join(__dirname, "../files/");
// console.log(staticFiles);
app.use(express.static(staticFiles));

//----------API from router----
app.use(login);
app.use(posts);

///----------Listening app --------------
app.listen(port, () => {
  console.log(`The app is listening on ${port} port `);
});

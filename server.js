const express = require("express");
const routes = require("./routes");
const sequelize = require("sequelize");
// import sequelize connection
const sequelizes = require("./config/connection");

//create app using port 3001 as default
const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use routes for all requests
app.use(routes);

// sync sequelize models to the database, then turn on the server

sequelizes.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});

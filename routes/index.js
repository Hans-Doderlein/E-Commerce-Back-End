const router = require("express").Router();
const apiRoutes = require("./api");

//all routes go through api router
router.use("/api", apiRoutes);

//if wrong route or non-existent route used
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>");
});

module.exports = router;

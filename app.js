const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var busboy = require("connect-busboy");

const ownerRoutes = require("./api/routes/ownerRoutes");
const managerRoutes = require("./api/routes/managerRoutes");
const landsRoutes = require("./api/routes/landsRoutes");
const operationsRoute = require("./api/routes/operationRoutes");
const plantRoutes = require("./api/routes/plantsRoutes");
const activitiesRoutes = require("./api/routes/activitiesRoutes");
const reportRoutes = require("./api/routes/reportRoutes");
const uploads = require("./api/routes/upload");

//side function
const sideLandsRoutes = require("./api/routes/sideLandsRoutes");

mongoose.connect(
  "mongodb+srv://admin:admin123@cluster0-odrr2.gcp.mongodb.net/Proplante?retryWrites=true&w=majority",
  function(err) {
    if (err) throw err;
    console.log("Connect to MongoDB Atlas successful!");
  }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(busboy());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// makes 'uploads' folder to public
app.use(express.static("uploads"));

app.use("/owners", ownerRoutes);
app.use("/managers", managerRoutes);
app.use("/lands", landsRoutes);
app.use("/operations", operationsRoute);
app.use("/plants", plantRoutes);
app.use("/activities", activitiesRoutes);
app.use("/reports", reportRoutes);
//-------side---------------
app.use("/sec/lands", sideLandsRoutes);
app.use("/aws", uploads);

app.use("/health", (req, res, next) => {
  res.sendFile(__dirname + '\\index.html');
  //res.status(200).send("server-health");
});

app.use((req, res, next) => {
  const error = new Error("Not found!!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

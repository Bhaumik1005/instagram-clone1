const express = require("express");
const app = express();
const Router = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORTNUM;
const passport = require("passport"); //Authentication Middleware
require("./db/mongoconnection").DbConnection(); //Connecting DB

app.use(passport.initialize());
app.set("view engine", "ejs");

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

//For Allow this Upper Ip
app.use(
  cors({
    origin: ["http://localhost:4200", "http://192.168.20.63:4200"],
  })
);

//For Set user Route
app.use("/instagramUser", Router);

//For Set Static Profile Route
app.use(
  "/uploadUserProfile/",
  express.static(path.join(__dirname, "../uploadUserProfile"))
);

//For Listen Server At Define Port
app.listen(PORT, () => console.log("Server is running.... at", { PORT }));

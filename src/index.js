const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Router = require("./routes/userRoutes")
const bodyParser = require("body-parser")
const cors = require("cors")
const ejs = require("ejs")
const path = require("path")
const dotenv = require('dotenv').config();
// const multer = require('multer')
// const upload = multer();
const PORT = process.env.PORTNUM;
const URL = process.env.DBURL;
const passport = require("passport"); //Authentication Middleware
// const passportJWT = require("passport-jwt"); //Authentication for JWT token 


app.use(passport.initialize());
app.set('view engine', 'ejs');
// app.use(bodyParser.json())
// app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
// app.use(express.urlencoded({ extended: true }));
// // for parsing multipart/form-data
// app.use(upload.none())
// app.use(upload.array()); 
// app.use(express.static('public'));


app.use(cors({
    origin: ['http://localhost:4200',
        'http://192.168.20.63:4200']
}));//For Allow this Upper Ip

app.use("/instagramUser", Router);//For Set user Route 
app.use('/uploadUserProfile/', express.static(path.join(__dirname, '../uploadUserProfile'))) //For Set Static Profile Route

//For Connect Mongoose
mongoose.connect(URL, {
    useNewUrlParser: true
});

//For DB Connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("opne", function () {
    console.log("Connected Successfully");
});


//For Start Server At Define Port
app.listen(PORT, () => console.log("Server is running.... at", { PORT }));
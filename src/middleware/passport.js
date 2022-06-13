const passport = require("passport"); //Authentication Middleware
const passportJWT = require("passport-jwt"); //Authentication for JWT token
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy; //For using JWT Strategy
const userModel = require("../model/userModel");
const dotenv = require("dotenv").config();
const JWTSECRATE = process.env.JWTSECRATE;

// passport.use(new JWTStrategy({
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Accept the request & return JWT
  secretOrKey: JWTSECRATE, //For Secrate Key
};

// Passportjs JWT Strategy
const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  userModel.findOne(
    { id: jwt_payload._id },
    {
      name: true,
      email: true,
      age: true,
      phoneNumber: true,
      profilePic: true,
    },
    (err, user) => {
      if (err) {
        return next(err, false);
      }

      if (!user) {
        return next(null, false);
      }

      return next(null, user);
    }
  );
});

passport.use(strategy);

import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import userModel from "../app/models/userModel";
import config from "../config/config";


const jwtOptions = {
          jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey : config.jwtSecrate
}

//passportjs JWT Strategy
const strategy = new Strategy(jwtOptions, (jwt_payload, next) => {

          userModel.findOne({ id: jwt_payload.id},
                    {
                              name :true,
                              email: true,
                              age: true,
                              phoneNumber: true,
                              profilePic: true
                    },(err, user) =>{
                              if(err){
                                   return next(err, false)
                              }

                              if(!user) {
                                        return next(null, false);
                              }

                    return next(null, user);
                    }
                    )
});

passport.use(strategy);
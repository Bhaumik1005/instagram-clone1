import Joi from "joi";
import fs from "fs";



//User-defined function to validate the user
exports.validateUser = async (req, res, next) =>{

          const schema = Joi.object({
      
              name: Joi.string()
                  .min(2)
                  .max(30)
                  .required()
              ,
      
              email: Joi.string()
                  .trim()
                  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'cloud'] } })
                  .required()
              ,
      
              password: Joi.string()
                  .min(8)
                  .max(15)
                  .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                  .required()
              ,
      
              age: Joi.string()
                  .min(0)
                  .max(50)
                  .required()
              ,
              phoneNumber: Joi.string()
                  .length(10)
                  .pattern(/^[0-9]+$/)
                  .required()
              ,
              isEmailValide: Joi.boolean()
                  .default(false)
          }
          );
      
      
          const { name, email, password, age, phoneNumber, isEmailValide } = req.body;
      
          const { error } = schema.validate({ name, email, password, age, phoneNumber, isEmailValide });
      
      
      
          if (error) {
              const email = req.body.email
              const filepath = '../instagram-clone/uploadUserProfile/' + email + "_profilePic.png"
      
              await fs.unlink(filepath, (err) => {
                  if (err) {
                      console.error(err)
                  }
                  console.log("Profile Picture Remove Successfully")
              });
      
              res.status(500).send({
                  error: error.message
              });
      
          } else {
              return next();
          }
      
      }
      
      
      //For Validate User Login Data
      exports.validateUserLogin = (req, res, next) =>{
          const schema = Joi.object({
      
              email: Joi.string()
                  .trim()
                  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'cloud'] } })
                  .required()
              ,
      
              password: Joi.string()
                  .min(8)
                  .max(15)
                  .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                  .required()
              ,
          })
      
      
          const { email, password } = req.body;
      
          const { error } = schema.validate({ email, password });
      
      
          if (error) {
              res.status(500).json({
                  error: error.message
              });
          } else {
              return next();
          }
      }
      
      //For Validate User Updated Data
      exports.validateUpdatedData = (req, res, next)=> {
          const schema = Joi.object({
      
              name: Joi.string()
                  .min(2)
                  .max(30)
                  .required()
              ,
              age: Joi.string()
                  .min(1)
                  .max(5)
                  .required()
              ,
              phoneNumber: Joi.string()
                  .length(10)
                  .pattern(/^[0-9]+$/)
                  .required()
              ,
          })
      
      
          const { name, age,phoneNumber } = req.body;
      
          const { error } = schema.validate({ name, age,phoneNumber });
      
      
          if (error) {
              res.status(500).json({
                  error: error.message
              });
          } else {
              return next();
          }
      }
      
const {body} = require(`express-validator`);
const UserModel = require(`../models/user`);

exports.validatorRegister = [
  body(`email`, `Please enter correct email`).isEmail().
    custom(async (value, {req}) => {
      try {
        const user = await UserModel.findOne({email: value});

        if (user) {
          return Promise.reject(`User with this email already exists`) 
        }

      } catch (error) {
        console.log(error);
      }
  }).normalizeEmail(),
  
  body(`password`, `Password must be at least 6 characters`).isLength({min: 6}).trim(),
  body(`password`, `Password must not be more than 32 characters`).isLength({max: 32}).trim(),
  body(`password`, `Password must be only letters and numbers`).isAlphanumeric().trim(),
  
  body(`name`, `Name must be at least 3 characters`).isLength({min: 3}).trim(),
  
  body(`confirm`).custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error(`Password repeat and password do not match`);
    } 
    
    return true;
  }).trim(),
];

exports.validatorCourse = [
  body(`course-name`, `The minimum length of the course name must be at least 3 characters`).
    isLength({min: 3}).
    trim(),
  
  body(`course-name`, `The maximum length of the course name must be no more than 32 characters.`).
    isLength({max: 32}).
    trim(),

  body(`course-price`, `The price must be indicated in numbers only`).
    isNumeric().
    trim(),

  body(`course-image-url`, `Enter the correct url of the picture`).
    isURL().
    trim(),
];
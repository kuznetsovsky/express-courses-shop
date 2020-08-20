const {body} = require(`express-validator`);

exports.validatorRegister = [
  body(`email`, `Please enter correct email`).isEmail(),
  
  body(`password`, `Password must be at least 6 characters`).isLength({min: 6}),
  body(`password`, `Password must not be more than 32 characters`).isLength({max: 32}),
  body(`password`, `Password must be only letters and numbers`).isAlphanumeric(),
  
  body(`name`, `Name must be at least 3 characters`).isLength({min: 3}),
  
  body(`confirm`).custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error(`Password repeat and password do not match`);
    } 
    
    return true;
  }),
];
const crypto = require(`crypto`);
const {Router} = require(`express`);
const {validationResult} = require(`express-validator`);
const bcrypt = require(`bcryptjs`);
const nodemailer = require(`nodemailer`);
const router = Router();

const UserModel = require(`../models/user`);

const {validatorRegister} = require(`../utils/validators`);

const emailRegisterTemplate = require(`../email-templates/registration`);
const resetPasswordTemplate = require(`../email-templates/reset`);


let transporter = nodemailer.createTransport({
  host: `smtp.mail.ru`,
  port: 465,
  secure: true,
  auth: {
    user: `firstname99@bk.ru`,
    pass: `Qwerty1323`,
  },
});


router.get(`/login`, async (req, res) => {
  res.render(`auth/login`, {
    title: `Authorization`,
    isLogin: true,
    registerError: req.flash(`registerError`),
    loginError: req.flash(`loginError`),
  });
});


router.post(`/login`, async (req, res) => {  
  try {
    const {email, password} = req.body;
    const candidate = await UserModel.findOne({email});

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) throw err;
          res.redirect(`/`);
        });
      } else {
        req.flash(`loginError`, `Wrong password`);
        res.redirect(`/auth/login#login`)
      }
    } else {
      req.flash(`loginError`, `User is not found`);
      res.redirect(`/auth/login#login`)
    }
  } catch (error) {
    console.log(error);
  }
});


router.get(`/logout`, async (req, res) => {
  req.session.destroy(() => {
    res.redirect(`/`);
  });
});


router.post(`/register`, validatorRegister, async (req, res) => {
  try {
    const {email, password, confirm, name} = req.body;
    const candidate = await UserModel.findOne({email});

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(`registerError`, errors.array()[0].msg);
      return res.status(422).redirect(`/auth/login#register`);
    }

    if (candidate) {
      req.flash(`registerError`, `User with this email already exists`);
      res.redirect(`/auth/login#register`);
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        email, name, password: hashPassword, cart: {items: []}
      });
      await user.save();
      res.redirect(`/auth/login#login`);
      await transporter.sendMail(emailRegisterTemplate(email));
    }
  } catch (error) {
    console.log(error);
  }
});


router.get(`/reset`, (req, res) => {
  res.render(`auth/reset`, {
    title: `Reset password`,
    resetError: req.flash(`resetError`),
  });
});


router.post(`/reset`, (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash(`resetError`, `Something went wrong, please try again later.`);
        return res.redirect(`/auth/reset`);
      }

      const token = buffer.toString(`hex`);
      const candidate = await UserModel.findOne({email: req.body.email});

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + (60 * 60) * 100;
        await candidate.save();
        await transporter.sendMail(resetPasswordTemplate(candidate.email, token));
        res.redirect(`/auth/login#login`);
      } else {
        req.flash(`resetError`, `Mail not found`);
        res.redirect(`/auth/reset`);
      }
    });
  } catch (error) {
    console.log(error);
  }
});


router.get(`/reset/pwd/:token`, async (req, res) => {
  if (!req.params.token) {
    return res.redirect(`/auth/login`);
  } 
  
  try {
    const user = await UserModel.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()},
    });
    
    if (!user) {
      res.redirect(`/auth/login`);    
    } else {
      res.render(`auth/recovery`, {
        title: `Change Password`,
        //recoveryError: req.flash(`recoveryError`),
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (error) {
    console.log(error);
  }
});


router.post(`/recovery`, async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    }); 

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect(`/auth/login`);
    } else {
      req.flash(`loginError`, `Token expired`);
      res.redirect(`/auth/login`);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
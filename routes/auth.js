const {Router} = require(`express`);
const bcrypt = require(`bcryptjs`);
const nodemailer = require(`nodemailer`);
const router = Router();
const UserModel = require(`../models/user`);
const emailRegisterTemplate = require(`../email-templates/registration`);

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


router.post(`/register`, async (req, res) => {
  try {
    const {email, password, repeat, name} = req.body;
    const candidate = await UserModel.findOne({email});

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

module.exports = router;
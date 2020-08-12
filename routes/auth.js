const {Router} = require(`express`);
const bcrypt = require(`bcryptjs`);
const router = Router();
const UserModel = require(`../models/user`);


router.get(`/login`, async (req, res) => {
  res.render(`auth/login`, {
    title: `Authorization`,
    isLogin: true,
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
        res.redirect(`/auth/login#login`)
      }
    } else {
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
      res.redirect(`/auth/login#register`);
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        email, name, password: hashPassword, cart: {items: []}
      });
      await user.save();
      res.redirect(`/auth/login#login`);
    }


  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
const {Router} = require(`express`);
const router = Router();
const UserModel = require(`../models/user`);


router.get(`/login`, async (req, res) => {
  res.render(`auth/login`, {
    title: `Authorization`,
    isLogin: true,
  });
});


router.post(`/login`, async (req, res) => {  
  const user = await UserModel.findById(`5f3147c001c738275d1ede44`);
  req.session.user = user;
  req.session.isAuthenticated = true;
  req.session.save((err) => {
    if (err) throw err;
    res.redirect(`/`);
  });
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
      const user = new UserModel({
        email, name, password, cart: {items: []}
      });
      await user.save();
      res.redirect(`/auth/login#login`);
    }


  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
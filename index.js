const path = require(`path`);
const mongoose = require('mongoose');
const express = require(`express`);
const exphbs = require(`express-handlebars`);
const app = express();

const mainRoute = require(`./routes/main`);
const coursesRoute = require(`./routes/courses`);
const addRoute = require(`./routes/add`);
const cardRoute = require(`./routes/card`);

const UserModel = require(`./models/user`);

const hbs = exphbs.create({
  defaultLayout: `main`,
  extname: `hbs`,
});

app.engine(`hbs`, hbs.engine);

app.set(`view engine`, `hbs`);
app.set(`views`, `views`);

app.use(async (req, res, next) => {
  try {
    const user = await UserModel.findById(`5f3147c001c738275d1ede44`);
    req.user = user;
    next();
  } catch (error) {
  }
});

app.use(express.static(path.join(__dirname, `public`)));
app.use(express.urlencoded({ extended: true }));

app.use(`/`, mainRoute);
app.use(`/courses`, coursesRoute);
app.use(`/add`, addRoute);
app.use(`/card`, cardRoute);

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    const URL = `mongodb+srv://comebas:gLlBIWOQqHqHC770@cluster0.gl3ie.mongodb.net/courseshop`;
    mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    const candidate = await UserModel.findOne();

    if (!candidate) {
      const user = UserModel({
        email: `example@mail.com`,
        name: `ExampleUserName`,
        cart: { items: [] },
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

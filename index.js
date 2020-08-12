const MONGODB_URI = `mongodb+srv://comebas:gLlBIWOQqHqHC770@cluster0.gl3ie.mongodb.net/courseshop`;

const path = require(`path`);
const mongoose = require('mongoose');
const session = require(`express-session`);
const MongoStore = require(`connect-mongodb-session`)(session);
const express = require(`express`);
const exphbs = require(`express-handlebars`);
const csurf = require(`csurf`);
const app = express();

const mainRoute = require(`./routes/main`);
const coursesRoute = require(`./routes/courses`);
const addRoute = require(`./routes/add`);
const cardRoute = require(`./routes/card`);
const ordersRoute = require(`./routes/orders`);
const authRoute = require(`./routes/auth`);

const UserModel = require(`./models/user`);

const varMiddleware = require(`./middleware/variables`);
const userMiddleware = require(`./middleware/user`);

const hbs = exphbs.create({
  defaultLayout: `main`,
  extname: `hbs`,
});

const store = new MongoStore({
  collection: `sessions`,
  uri: MONGODB_URI,
});

app.engine(`hbs`, hbs.engine);

app.set(`view engine`, `hbs`);
app.set(`views`, `views`);

app.use(express.static(path.join(__dirname, `public`)));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: `some secret value`,
  resave: false,
  saveUninitialized: false,
  store,
}));

app.use(csurf());
app.use(varMiddleware);
app.use(userMiddleware);

app.use(`/`, mainRoute);
app.use(`/courses`, coursesRoute);
app.use(`/add`, addRoute);
app.use(`/card`, cardRoute);
app.use(`/orders`, ordersRoute);
app.use(`/auth`, authRoute);

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    // const candidate = await UserModel.findOne();

    // if (!candidate) {
    //   const user = UserModel({
    //     email: `example@mail.com`,
    //     name: `ExampleUserName`,
    //     cart: { items: [] },
    //   });

    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

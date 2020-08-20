const path = require(`path`);
const mongoose = require('mongoose');
const session = require(`express-session`);
const MongoStore = require(`connect-mongodb-session`)(session);
const express = require(`express`);
const exphbs = require(`express-handlebars`);
const csurf = require(`csurf`);
const flash = require('connect-flash');
const app = express();

const mainRoute = require(`./routes/main`);
const coursesRoute = require(`./routes/courses`);
const addRoute = require(`./routes/add`);
const cardRoute = require(`./routes/card`);
const ordersRoute = require(`./routes/orders`);
const authRoute = require(`./routes/auth`);
const profileRoute = require(`./routes/profile`);

const varMiddleware = require(`./middleware/variables`);
const userMiddleware = require(`./middleware/user`);
const errorMiddleware = require(`./middleware/error`);

const keys = require(`./keys`);

const hbs = exphbs.create({
  defaultLayout: `main`,
  extname: `hbs`,
  helpers: require(`./utils/hbs-helpers`),
});

const store = new MongoStore({
  collection: `sessions`,
  uri: keys.MONGODB_URI,
});

app.engine(`hbs`, hbs.engine);

app.set(`view engine`, `hbs`);
app.set(`views`, `views`);

app.use(express.static(path.join(__dirname, `public`)));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}));

app.use(csurf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use(`/`, mainRoute);
app.use(`/courses`, coursesRoute);
app.use(`/add`, addRoute);
app.use(`/card`, cardRoute);
app.use(`/orders`, ordersRoute);
app.use(`/auth`, authRoute);
app.use(`/profile`, profileRoute);
app.use(errorMiddleware);

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

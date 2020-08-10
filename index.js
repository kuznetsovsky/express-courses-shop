const path = require(`path`);
const express = require(`express`);
const exphbs = require(`express-handlebars`);
const app = express();

const mainRoute = require(`./routes/main`);
const coursesRoute = require(`./routes/courses`);
const addRoute = require(`./routes/add`);
const cardRoute = require(`./routes/card`);

const hbs = exphbs.create({
  defaultLayout: `main`,
  extname: `hbs`,
});

app.engine(`hbs`, hbs.engine);
app.set(`view engine`, `hbs`);
app.set(`views`, `views`);

app.use(express.static(path.join(__dirname, `public`)));
app.use(express.urlencoded({extended: true}));

app.use(`/`, mainRoute);
app.use(`/courses`, coursesRoute);
app.use(`/add`, addRoute);
app.use(`/card`, cardRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
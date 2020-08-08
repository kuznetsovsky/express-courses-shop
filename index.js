const path = require(`path`);
const express = require(`express`);
const app = express();

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, `views`, `main.html`));
});

app.get(`/about`, (req, res) => {
  res.sendFile(path.join(__dirname, `views`, `about.html`));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const path = require(`path`);
const fs =require(`fs`);
const { v4: uuid } = require('uuid');

class Course {
  constructor(title, price, imageUrl) {
    this._id = uuid();
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  async save() {
    const courses = await Course.getAll();
    courses.push(this.toJSON());

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, `..`, `data`, `courses.json`),
        JSON.stringify(courses),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve()
          }
        }
      )
    });
  }

  toJSON() {
    return {
      _id: this._id,
      title: this.title,
      price: this.price,
      imageUrl: this.imageUrl,
    }
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, `..`, `data`, `courses.json`),
        `utf-8`,
        (err, content) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(content));
          }
        }
      )    
    });
  }
}

module.exports = Course;
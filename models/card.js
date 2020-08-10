const path = require(`path`);
const fs = require(`fs`);

const _path = path.join(
  path.dirname(process.mainModule.filename),
  `data`,
  `card.json`,
);

class Card {

  static async add(course) {
    const card = await Card.fetch()
    const index = card.courses.findIndex((it) => it._id === course._id);
    const candidate = card.courses[index];

    if (candidate) {
      candidate.count++;
      card.courses[index] = candidate;
    } else {
      course.count = 1;
      card.courses.push(course);
    }

    card.totalPrice += parseInt(course.price);
    
    return new Promise((resolve, reject) => {
      fs.writeFile(_path, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async remove(id) {
    const card = await Card.fetch();
    const index = card.courses.findIndex((it) => it._id === id);
    const course = card.courses[index];

    if (course.count === 1) {
      card.courses = card.courses.filter((it) => it._id !== id);
    } else {
      card.courses[index].count--;
    }

    card.totalPrice -= course.price;
    
    return new Promise((resolve, reject) => {
      fs.writeFile(_path, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(card);
        }
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(_path, `utf-8`, (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      })      
    });
  }
}

module.exports = Card;
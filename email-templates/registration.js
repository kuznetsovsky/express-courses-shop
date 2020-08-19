const keys = require(`../keys`);

module.exports = function(to) {
  return {
    to,
    from: `NodeJS course <firstname99@bk.ru>`,
    subject: `Confirmation of registration in the course store`,
    html: `
      <h1>Registering an account on Course shop</h1>
      <p>Account ${to} registered, confirm registration by clicking on the link below.</p>
      <hr>
      <a href="${keys.BASE_URL}">Courses shop</a>
    ` 
  }
}
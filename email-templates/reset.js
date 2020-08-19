const keys = require(`../keys`);

module.exports = function(to, token) {
  return {
    to,
    from: `NodeJS course <firstname99@bk.ru>`,
    subject: `Steps to reset your password`,
    html: `
      <h1>Forgotten password recovery on Course shop</h1>
      <p>To reset your password, you need to click on the button below. This will confirm the password reset request. If you are not requesting a reset to reset, DO NOT click on the link below and ignore this email.</p>
      <p><a href="${keys.BASE_URL}/auth/reset/pwd/${token}">Reset the password</a></p>
      <hr>
      <a href="${keys.BASE_URL}">Courses shop</a>
    ` 
  }
}
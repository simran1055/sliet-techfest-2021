const md5 = require('md5');

// password encryption.
exports.encryptpassword = (password) => {
  return md5(password);
};
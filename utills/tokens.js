import md5 from 'md5';

// password encryption.
exports.encryptpassword = (password) => {
    return md5(password);
  };
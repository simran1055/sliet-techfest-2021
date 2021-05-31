import md5 from 'md5';

// password encryption.
export const encryptpassword = (password) => {
    return md5(password);
  };
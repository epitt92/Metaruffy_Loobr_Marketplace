var aes256 = require("aes256");

var key = process.env.NEXT_PUBLIC_AES_SECRET_KEY;

export const DoEncrypt = (text: any) => {
  var encrypted = aes256.encrypt(key, text);
  return encrypted;
};
export const DoDecrypt = (cipher: any) => {
  try {
    var decrypted = aes256.decrypt(key, cipher);
    return decrypted;
  } catch (err) {
    // console.log(cipher, "Error with key", key);
    // console.log(err);
  }
};

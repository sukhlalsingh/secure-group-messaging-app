const crypto = require('crypto');
const key = Buffer.from('1234567890abcdef', 'utf-8');

function encryptMessage(text) {
  const cipher = crypto.createCipheriv('aes-128-cbc', key, key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
module.exports = { encryptMessage };
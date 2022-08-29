const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  name: String,
  password: String,
  email: String,
  provider: String,
  providerId: String,
  createdAt: String,
});

module.exports = model('User', userSchema);

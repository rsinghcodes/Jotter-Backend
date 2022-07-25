const { model, Schema } = require('mongoose');

const pastebinSchema = new Schema({
  details: String,
  createdAt: String,
});

module.exports = model('Pastebin', pastebinSchema);

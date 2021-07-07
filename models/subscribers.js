const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      trim: true,
   }
})

module.exports = mongoose.model('Subscribers', EmailSchema)

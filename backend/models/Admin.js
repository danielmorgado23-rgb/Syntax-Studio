// ========================= models/Admin.js =========================

const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({

  usuario: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }

});

module.exports =
  mongoose.model('Admin', AdminSchema);


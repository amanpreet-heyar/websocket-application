const mongoose = require("mongoose");


const imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   
  
    createdAt: { type: Date, default: Date.now }
  });
  
  const Image = mongoose.model('Image', imageSchema);
  module.exports= Image
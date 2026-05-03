const mongoose = require('mongoose');

const hotelInfoSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: mongoose.Schema.Types.Mixed,
    default: 0
  },
  price: {
    type: String,
    default: "N/A"
  },
  location: String,
  lat: Number,
  lng: Number,
  link: String,
  photo_url: String,
  maxGuests: {
    type: Number,
    default: 4
  }
}, { timestamps: true });

module.exports = mongoose.model('Hotel_Info', hotelInfoSchema,'Hotel_Info');

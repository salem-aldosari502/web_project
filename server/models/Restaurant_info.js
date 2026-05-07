const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  AuthorName: { type: String },
  Rating:     { type: Number }
}, { _id: false });

const restaurantInfoSchema = new mongoose.Schema({
  RestaurantName: { type: String, required: true },
  RestaurantID:   { type: String, required: true, unique: true },
  Price:          { type: Number },
  Rating:         { type: Number },
  Review:         [ReviewSchema],  
  Location: {
    lng: { type: Number },
    lat: { type: Number }
  },
  FinancialRange: {
    type: String,
    enum: ['Affordable', 'Moderate', 'Expensive', 'N/A'],
    default: 'N/A'
  },
  MaxGuests:   { type: String, default: 'N/A' },
  Description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Restaurant_info", restaurantInfoSchema, "Restaurant_info");
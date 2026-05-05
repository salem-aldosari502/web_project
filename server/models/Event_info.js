const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    EventName: { type: String, required: true },
    EventID: { type: String, unique: true },
    Price: { type: Number, default: null },
    Rating: { type: Number, default: null },
    Review: { type: Array, default: [] },
    Location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    Address: { type: String, default: null },
    FinancialRange: { type: String, enum: ["Affordable", "Moderate", "Expensive", "N/A"], default: "N/A" },
    MaxGuests: { type: mongoose.Schema.Types.Mixed, default: "N/A" },
    Description: { type: String, default: "N/A" },
    Date: { type: String, default: null },
    Time: { type: String, default: null },
    Link: { type: String, default: null },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event_info', eventSchema, 'Event_info');
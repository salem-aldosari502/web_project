const axios = require('axios');
const HotelInfo = require('../models/Hotel_info');

exports.getHotels = async (req, res) => {
  try {
    const hotels = await HotelInfo.find().lean();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

exports.createHotels = async (req, res) => {
  try {
    const hotels = req.body;
    await HotelInfo.deleteMany({});
    const savedHotels = await HotelInfo.insertMany(hotels);
    res.json(savedHotels);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

exports.getGoogleHotels = async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formatDate = (date) => date.toISOString().split("T")[0];

    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_hotels",
        q: "hotels in kuwait",
        check_in_date: formatDate(today),
        check_out_date: formatDate(tomorrow),
        api_key: process.env.API_KEY_HOTELS
      }
    });

    const apiHotels = response.data.properties || [];
    const hotelsList = apiHotels.map((hotel, index) => ({
      id: `H${(index + 1).toString().padStart(3, "0")}`,
      name: hotel.name,
      rating: hotel.rating || "N/A",
      price: hotel.rate_per_night?.lowest || "N/A",
      location: hotel.address,
      lat: hotel.gps_coordinates?.latitude,
      lng: hotel.gps_coordinates?.longitude,
      link: hotel.link || "",
      photo_url: hotel.photos?.[0]?.image || null,
      image: hotel.photos?.[0]?.image || null,
      maxGuests: 4
    }));

    await HotelInfo.deleteMany({});
    await HotelInfo.insertMany(hotelsList);

    res.json(hotelsList);
  } catch (err) {
    console.error('Google Hotels API error:', err.message);
    res.status(500).json({error: 'Failed to fetch hotels'});
  }
};

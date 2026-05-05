const axios = require('axios');
const HotelInfo = require('../models/Hotel_info');

const mapPriceLevel = (level) => {
  if (level === 0 || level === 1) return "Affordable";
  if (level === 2) return "Moderate";
  if (level === 3 || level === 4) return "Expensive";
  return "N/A";
};

const fetchHotels = async () => {
  let allResults = [];
  let nextPageToken = null;

  for (let i = 0; i < 3; i++) {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: "hotels in kuwait",
          key: process.env.GOOGLE_API_KEY,
          pagetoken: nextPageToken,
        },
      }
    );

    const results = response.data.results || [];
    allResults.push(...results);
    nextPageToken = response.data.next_page_token;
    if (!nextPageToken) break;
    await new Promise((r) => setTimeout(r, 2000));
  }

  return allResults;
};

const mapHotels = (places) => {
  return places.map((place, index) => ({
    id: place.place_id,                                         
    name: place.name || "N/A",                                  
    rating: place.rating || 0,                                 
    price: mapPriceLevel(place.price_level),                  
    location: place.vicinity || place.formatted_address || null,
    lat: place.geometry?.location?.lat || null,                 
    lng: place.geometry?.location?.lng || null,                 
    link: null,                                                 
    photo_url: null,                                            
    maxGuests: 4,                                               
  }));
};

exports.getGoogleHotels = async (req, res) => {
  try {
    const places = await fetchHotels();
    console.log(`Fetched ${places.length} hotels from Google API`);

    const mapped = mapHotels(places);

    const uniqueMap = new Map();
    mapped.forEach(h => uniqueMap.set(h.id, h));
    const uniqueHotels = [...uniqueMap.values()];

    await HotelInfo.deleteMany({});
    const result = await HotelInfo.insertMany(uniqueHotels, { ordered: false });
    console.log(`Inserted ${result.length} hotels`);

    res.json(result);
  } catch (err) {
    console.error("Google Hotels API error:", err.message);
    try {
      const hotels = await HotelInfo.find().lean();
      if (hotels.length === 0) {
        return res.status(404).json({ error: 'No hotels in DB and API failed' });
      }
      res.json(hotels);
    } catch (dbErr) {
      res.status(500).json({ error: 'DB error' });
    }
  }
};

exports.getHotels = async (req, res) => {
  try {
    const hotels = await HotelInfo.find().lean();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHotels = async (req, res) => {
  try {
    const hotels = req.body;
    await HotelInfo.deleteMany({});
    const saved = await HotelInfo.insertMany(hotels);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
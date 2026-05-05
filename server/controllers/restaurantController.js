const axios = require('axios');
const RestaurantInfo = require('../models/Restaurant_info');

const fetchRestaurants = async () => {
  let allResults = [];
  let nextPageToken = null;

  for (let i = 0; i < 3; i++) {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: "restaurants in kuwait",
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

const mapPriceLevel = (level) => {
  if (level === 0 || level === 1) return "Affordable";
  if (level === 2) return "Moderate";
  if (level === 3 || level === 4) return "Expensive";
  return "N/A";
};

const fetchReviews = async (placeId) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    return response.data.result?.reviews || [];
  } catch (err) {
    return [];
  }
};

const mapRestaurants = async (places) => {
  const mapped = await Promise.all(
    places.map(async (place) => {
      const reviews = await fetchReviews(place.place_id);
      return {
        RestaurantName: place.name || "N/A",
        RestaurantID:   place.place_id,
        Price:          place.price_level !== undefined ? place.price_level * 5 : null,
        Rating:         place.rating || null,
        Review: reviews.map((r) => ({   // ✅ no outer [ ]
          AuthorName: r.author_name,
          Rating:     r.rating,
        })),
        Location: {
          lng: place.geometry?.location?.lng,
          lat: place.geometry?.location?.lat,
        },
        FinancialRange: mapPriceLevel(place.price_level),
        MaxGuests:   'N/A',
        Description: place.vicinity || place.formatted_address || "N/A",
      };
    })
  );
  return mapped;
};

exports.getRestaurants = async (req, res) => {
  try {
    const places = await fetchRestaurants();
    console.log(`Fetched ${places.length} places from Google API`);

    const restaurants = await mapRestaurants(places);

    // ✅ Deduplicate by RestaurantID before inserting
    const uniqueMap = new Map();
    restaurants.forEach(r => uniqueMap.set(r.RestaurantID, r));
    const uniqueRestaurants = [...uniqueMap.values()];

    await RestaurantInfo.deleteMany({});
    const result = await RestaurantInfo.insertMany(uniqueRestaurants, { ordered: false });
    console.log(`Inserted ${result.length} of ${uniqueRestaurants.length} restaurants`);

    res.json(result);
  } catch (err) {
    console.error("Full error:", err);
    // Fallback to DB
    try {
      const restaurants = await RestaurantInfo.find().lean();
      if (restaurants.length === 0) {
        return res.status(404).json({error: 'No restaurants in DB and API failed'});
      }
      res.json(restaurants);
    } catch (dbErr) {
      res.status(500).json({error: 'DB error'});
    }
  }
};

exports.getDbRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantInfo.find().lean();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRestaurants = async (req, res) => {
  try {
    const restaurants = req.body;
    await RestaurantInfo.deleteMany({});
    const savedRestaurants = await RestaurantInfo.insertMany(restaurants);
    res.json(savedRestaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


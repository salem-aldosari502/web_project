const axios = require('axios');
const EventInfo = require('../models/Event_info');

const mapPriceLevel = (priceStr) => {
  if (!priceStr) return "N/A";
  const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  if (isNaN(price)) return "N/A";
  if (price <= 10) return "Affordable";
  if (price <= 30) return "Moderate";
  return "Expensive";
};

const fetchEvents = async () => {
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_events",
        q: "events in kuwait",
        hl: "en",
        gl: "kw",
        api_key: process.env.API_KEY_HOTELS
      }
    });

    console.log("SerpAPI Events response keys:", Object.keys(response.data));
    return response.data.events_results || [];
  } catch (err) {
    console.error("SerpAPI Events fetch error:", err.response?.status, err.response?.data || err.message);
    return [];
  }
};

const mapEvents = (events) => {
  return events.map((event, index) => {
    const priceStr = event.ticket_info?.[0]?.price || null;
    const dateStr = event.date?.start_date || null;
    const timeStr = event.date?.when || null;

    return {
      EventName: event.title || "N/A",
      EventID: `SEVT${index + 1}`,
      Price: priceStr ? parseFloat(priceStr.replace(/[^0-9.]/g, '')) : null,
      Rating: null,
      Review: [],
      Location: {
        lat: event.venue?.rating ? null : null, // SerpAPI events don't return coordinates
        lng: null,
      },
      FinancialRange: mapPriceLevel(priceStr),
      MaxGuests: "N/A",
      Description: event.description || event.venue?.name || "N/A",
      Date: dateStr,
      Time: timeStr,
      Link: event.ticket_info?.[0]?.link || null,
      image: event.thumbnail || null,
      Address: event.address?.join(", ") || null,
    };
  });
};

exports.getGoogleEvents = async (req, res) => {
  try {
    const events = await fetchEvents();
    console.log(`Fetched ${events.length} events from SerpAPI`);

    if (events.length === 0) {
      const dbEvents = await EventInfo.find().lean();
      return res.json(dbEvents);
    }

    const mapped = mapEvents(events);

    const uniqueMap = new Map();
    mapped.forEach((e, i) => uniqueMap.set(e.EventID, e));
    const uniqueEvents = [...uniqueMap.values()];

    await EventInfo.deleteMany({});
    const result = await EventInfo.insertMany(uniqueEvents, { ordered: false });
    console.log(`Inserted ${result.length} events`);

    res.json(result);
  } catch (err) {
    console.error("Full error:", err.message);
    try {
      const events = await EventInfo.find().lean();
      if (events.length === 0) {
        return res.status(404).json({ error: 'No events in DB and API failed' });
      }
      res.json(events);
    } catch (dbErr) {
      res.status(500).json({ error: 'DB error' });
    }
  }
};

exports.getDbEvents = async (req, res) => {
  try {
    const events = await EventInfo.find().lean();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEvents = async (req, res) => {
  try {
    const events = req.body;
    await EventInfo.deleteMany({});
    const saved = await EventInfo.insertMany(events);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
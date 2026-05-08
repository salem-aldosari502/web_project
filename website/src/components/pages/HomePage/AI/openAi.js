import OpenAI from "openai";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;

if (!apiKey) {
  console.error(
    "Error: REACT_APP_OPENAI_API_KEY is not set in environment variables."
  );
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});


// ==========================
// FETCH HOTELS
// ==========================
async function fetchHotels() {
  try {
    const res = await fetch(`${API_URL}/api/hotels/google`);

    if (!res.ok) return [];

    const data = await res.json();

    const hotels = Array.isArray(data)
      ? data
      : data.hotels || [];

    return hotels.map((h) => ({
      name: h.name,
      location: h.location || h.address,
      rating: h.rating,
      price: h.price,
      amenities: h.amenities,
      status: h.status,
      description: h.description,
    }));
  } catch (err) {
    console.error("Hotels Fetch Error:", err);
    return [];
  }
}


// ==========================
// FETCH RESTAURANTS
// ==========================
async function fetchRestaurants() {
  try {
    const res = await fetch(`${API_URL}/api/restaurants`);

    if (!res.ok) return [];

    const data = await res.json();

    const restaurants = Array.isArray(data)
      ? data
      : data.restaurants || [];

    return restaurants.map((r) => ({
      name: r.RestaurantName,
      id: r.RestaurantID,
      rating: r.Rating,
      price: r.Price,
      reviews: r.Review,
      financialRange: r.FinancialRange,
      description: r.Description,
      maxGuests: r.MaxGuests,
      location:
        r.Location?.address ||
        r.location ||
        "Kuwait",
    }));
  } catch (err) {
    console.error("Restaurant Fetch Error:", err);
    return [];
  }
}


// ==========================
// FETCH EVENTS
// ==========================
async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/api/events`);

    if (!res.ok) return [];

    const data = await res.json();

    const events = Array.isArray(data)
      ? data
      : data.events || [];

    return events.map((e) => ({
      name: e.name || e.title,
      date: e.date || e.startDate,
      venue: e.location || e.venue,
      price: e.price,
      status: e.status,
      category: e.category,
      description: e.description,
    }));
  } catch (err) {
    console.error("Events Fetch Error:", err);
    return [];
  }
}


// ==========================
// FORMAT HOTELS
// ==========================
function formatHotels(hotels) {
  if (!hotels.length) {
    return "No hotels available.";
  }

  return hotels
    .map((h, i) => {
      const lines = [`${i + 1}. ${h.name}`];

      if (h.location) {
        lines.push(`Location: ${h.location}`);
      }

      if (h.rating !== undefined) {
        lines.push(`Rating: ${h.rating}/5`);
      }

      if (h.price !== undefined) {
        lines.push(`Price: ${h.price}`);
      }

      if (h.description) {
        lines.push(`Description: ${h.description}`);
      }

      return lines.join("\n");
    })
    .join("\n\n");
}


// ==========================
// FORMAT RESTAURANTS
// ==========================
function formatRestaurants(restaurants) {
  if (!restaurants.length) {
    return "No restaurants available.";
  }

  return restaurants
    .map((r, i) => {
      const lines = [`${i + 1}. ${r.name}`];

      if (r.rating !== undefined && r.rating !== null) {
        lines.push(`Rating: ${r.rating}/5`);
      }

      if (r.price !== undefined && r.price !== null) {
        lines.push(`Average Price: ${r.price} KD`);
      }

      if (r.financialRange) {
        lines.push(`Price Range: ${r.financialRange}`);
      }

      if (r.location) {
        lines.push(`Location: ${r.location}`);
      }

      if (r.description) {
        lines.push(`Description: ${r.description}`);
      }

      return lines.join("\n");
    })
    .join("\n\n");
}


// ==========================
// FORMAT EVENTS
// ==========================
function formatEvents(events) {
  if (!events.length) {
    return "No events available.";
  }

  return events
    .map((e, i) => {
      const lines = [`${i + 1}. ${e.name}`];

      if (e.date) {
        lines.push(`Date: ${e.date}`);
      }

      if (e.venue) {
        lines.push(`Venue: ${e.venue}`);
      }

      if (e.price !== undefined) {
        lines.push(`Price: ${e.price}`);
      }

      if (e.category) {
        lines.push(`Category: ${e.category}`);
      }

      if (e.description) {
        lines.push(`Description: ${e.description}`);
      }

      return lines.join("\n");
    })
    .join("\n\n");
}


// ==========================
// SYSTEM PROMPT
// ==========================
function buildSystemPrompt(hotels, restaurants, events) {
  return `
You are Trip Kuwait AI Assistant.

Use ONLY the provided database information.
Do NOT invent information.
If data is unavailable, say:
"I don't have that information available right now."

HOTELS:
${formatHotels(hotels)}

RESTAURANTS:
${formatRestaurants(restaurants)}

EVENTS:
${formatEvents(events)}

Rules:
- Keep answers short and clean
- Use bullet points when listing recommendations
- Recommend based on ratings and available information
- Stay focused on tourism in Kuwait
`.trim();
}


// ==========================
// CACHE
// ==========================
let cachedData = null;
let cacheTimestamp = null;

const CACHE_DURATION_MS = 5 * 60 * 1000;


// ==========================
// GET LIVE DATA
// ==========================
async function getLiveData() {
  const now = Date.now();

  if (
    cachedData &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION_MS
  ) {
    return cachedData;
  }

  const [hotels, restaurants, events] =
    await Promise.all([
      fetchHotels(),
      fetchRestaurants(),
      fetchEvents(),
    ]);

  cachedData = {
    hotels,
    restaurants,
    events,
  };

  cacheTimestamp = now;

  return cachedData;
}


// ==========================
// CHAT HISTORY
// ==========================
const conversationHistory = [];

const MAX_HISTORY = 10;


// ==========================
// MAIN AI FUNCTION
// ==========================
export async function getAIResponse(userMessage) {
  try {

    const { hotels, restaurants, events } =
      await getLiveData();

    const msg = userMessage.toLowerCase();

    let filteredHotels = [];
    let filteredRestaurants = [];
    let filteredEvents = [];


    // ==========================
    // SMART FILTERING
    // ==========================
    if (
      msg.includes("restaurant") ||
      msg.includes("food") ||
      msg.includes("eat")
    ) {

      filteredRestaurants = [...restaurants]
        .sort((a, b) =>
          (b.rating || 0) - (a.rating || 0)
        )
        .slice(0, 15);

    }

    else if (
      msg.includes("hotel") ||
      msg.includes("stay") ||
      msg.includes("room")
    ) {

      filteredHotels = [...hotels]
        .sort((a, b) =>
          (b.rating || 0) - (a.rating || 0)
        )
        .slice(0, 15);

    }

    else if (
      msg.includes("event") ||
      msg.includes("concert") ||
      msg.includes("festival")
    ) {

      filteredEvents = events.slice(0, 15);

    }

    else {

      filteredHotels = hotels.slice(0, 5);
      filteredRestaurants = restaurants.slice(0, 5);
      filteredEvents = events.slice(0, 5);

    }


    const systemPrompt = buildSystemPrompt(
      filteredHotels,
      filteredRestaurants,
      filteredEvents
    );


    conversationHistory.push({
      role: "user",
      content: userMessage,
    });


    const trimmedHistory =
      conversationHistory.slice(
        -MAX_HISTORY * 2
      );


    const response =
      await openai.chat.completions.create({
        model: "gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...trimmedHistory,
        ],

        temperature: 0.4,

        max_tokens: 500,
      });


    const assistantMessage =
      response.choices[0].message.content;


    conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });


    return assistantMessage;

  } catch (error) {

    console.error(
      "AI Service Error:",
      error
    );

    return "Sorry, something went wrong while processing your request.";
  }
}


// ==========================
// CLEAR CACHE
// ==========================
export function clearAIDataCache() {
  cachedData = null;
  cacheTimestamp = null;
}


// ==========================
// CLEAR CHAT HISTORY
// ==========================
export function clearConversationHistory() {
  conversationHistory.length = 0;
}
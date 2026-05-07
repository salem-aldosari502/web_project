import OpenAI from "openai";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;

if (!apiKey) {
  console.error("Error: REACT_APP_OPENAI_API_KEY is not set in the environment variables.");
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});


async function fetchHotels() {
  try {
    const res = await fetch(`${API_URL}/api/hotels/google`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.hotels || [];
  } catch {
    return [];
  }
}

async function fetchRestaurants() {
  try {
    const res = await fetch(`${API_URL}/api/restaurants/db`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.restaurants || [];
  } catch {
    return [];
  }
}

async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/api/events`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.events || [];
  } catch {
    return [];
  }
}


function formatHotels(hotels) {
  if (!hotels.length) return "No hotels available at the moment.";
  return hotels
    .map((h, i) => {
      const lines = [`${i + 1}. ${h.name || "Unnamed Hotel"}`];
      if (h.location || h.address)  lines.push(`   Location: ${h.location || h.address}`);
      if (h.price !== undefined)    lines.push(`   Price: ${h.price}`);
      if (h.rating !== undefined)   lines.push(`   Rating: ${h.rating}/5`);
      if (h.amenities?.length)      lines.push(`   Amenities: ${h.amenities.join(", ")}`);
      if (h.status)                 lines.push(`   Status: ${h.status}`);
      if (h.description)            lines.push(`   Description: ${h.description}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

function formatRestaurants(restaurants) {
  if (!restaurants.length) return "No restaurants available at the moment.";
  return restaurants
    .map((r, i) => {
      const lines = [`${i + 1}. ${r.name || "Unnamed Restaurant"}`];
      if (r.location || r.address)  lines.push(`   Location: ${r.location || r.address}`);
      if (r.cuisine)                lines.push(`   Cuisine: ${r.cuisine}`);
      if (r.rating !== undefined)   lines.push(`   Rating: ${r.rating}/5`);
      if (r.priceRange || r.price)  lines.push(`   Price Range: ${r.priceRange || r.price}`);
      if (r.status)                 lines.push(`   Status: ${r.status}`);
      if (r.openingHours || r.hours)lines.push(`   Hours: ${r.openingHours || r.hours}`);
      if (r.description)            lines.push(`   Description: ${r.description}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

function formatEvents(events) {
  if (!events.length) return "No events available at the moment.";
  return events
    .map((e, i) => {
      const lines = [`${i + 1}. ${e.name || e.title || "Unnamed Event"}`];
      if (e.date || e.startDate)    lines.push(`   Date: ${e.date || e.startDate}`);
      if (e.location || e.venue)    lines.push(`   Venue: ${e.location || e.venue}`);
      if (e.price !== undefined)    lines.push(`   Price: ${e.price}`);
      if (e.status)                 lines.push(`   Status: ${e.status}`);
      if (e.category)               lines.push(`   Category: ${e.category}`);
      if (e.description)            lines.push(`   Description: ${e.description}`);
      return lines.join("\n");
    })
    .join("\n\n");
}


function buildSystemPrompt(hotels, restaurants, events) {
  return `
You are a friendly and knowledgeable AI assistant for Trip Kuwait — a travel and tourism website focused on Kuwait.

You have been given real-time data from the website's database. Use ONLY this data to answer questions about hotels, restaurants, and events. Do not fabricate, guess, or use information outside of what is provided below.

════════════════════════════════════════
📋 LIVE DATABASE — HOTELS (${hotels.length} total)
════════════════════════════════════════
${formatHotels(hotels)}

════════════════════════════════════════
🍽️ LIVE DATABASE — RESTAURANTS (${restaurants.length} total)
════════════════════════════════════════
${formatRestaurants(restaurants)}

════════════════════════════════════════
🎉 LIVE DATABASE — EVENTS (${events.length} total)
════════════════════════════════════════
${formatEvents(events)}

════════════════════════════════════════
📌 HOW TO ANSWER
════════════════════════════════════════
- Answer using only the data provided above
- If a user asks about a specific hotel, restaurant, or event, find it in the data and share its details
- If the user asks for recommendations, compare options from the data (e.g., by rating, price, or location)
- If something is not in the data, say: "I don't have that information available right now."
- Always mention the status (e.g., open, closed, available) if it's in the data
- Use bullet points or short paragraphs to keep responses readable
- Be warm, concise, and helpful — like a knowledgeable local guide

════════════════════════════════════════
🌍 SCOPE
════════════════════════════════════════
Primarily help with:
- Hotels: prices, amenities, location, availability, ratings
- Restaurants: cuisine, hours, location, price range, ratings
- Events: dates, venues, ticket prices, categories
- Travel tips and planning within Kuwait

If a question is completely unrelated to travel or tourism, gently redirect:
"I'm here to help with hotels, restaurants, events, and travel planning in Kuwait. Let me know what you'd like to explore!"

Do NOT provide medical, legal, financial, political, or religious advice.
`.trim();
}


let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; 

async function getLiveData() {
  const now = Date.now();
  if (cachedData && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION_MS) {
    return cachedData;
  }
  const [hotels, restaurants, events] = await Promise.all([
    fetchHotels(),
    fetchRestaurants(),
    fetchEvents(),
  ]);
  cachedData = { hotels, restaurants, events };
  cacheTimestamp = now;
  return cachedData;
}


const conversationHistory = [];
const MAX_HISTORY = 10; 


export async function getAIResponse(userMessage) {
  try {

    const { hotels, restaurants, events } = await getLiveData();
    const systemPrompt = buildSystemPrompt(hotels, restaurants, events);

    conversationHistory.push({ role: "user", content: userMessage });

    const trimmedHistory = conversationHistory.slice(-MAX_HISTORY * 2);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...trimmedHistory,
      ],
      temperature: 0.5,
      max_tokens: 600,
    });

    const assistantMessage = response.choices[0].message.content;

    conversationHistory.push({ role: "assistant", content: assistantMessage });

    return assistantMessage;
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Sorry, I ran into an issue. Please try again in a moment.";
  }
}

export function clearAIDataCache() {
  cachedData = null;
  cacheTimestamp = null;
}

export function clearConversationHistory() {
  conversationHistory.length = 0;
}
import axios from "axios";
import EventCard from "./EventCard";
import SearchBar from "../../SearchBar";
import { useState, useEffect, useMemo } from "react";
import DetailsPopup from "../../DetailsPopup";
import FilterBar from "../../FilterBar";
import FilterPanel from "../FilterPanel/EventFilterPanel";

function EventPage() {
  const category = "Events";
  const [searchValue, setSearchValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
  search: "",
  location: "",
  date: "",
  rating: 0,
  price: "",
  financialRange: ""
});

  function openPopup(event) {
    setSelectedEvent(event);
    setShowPopup(true);
  }

  function closePopup() {
    setShowPopup(false);
    setSelectedEvent(null);
  }

  const normalizeEvent = (e) => ({
    ...e,
    Location: typeof e.Location === "object" && e.Location !== null
      ? `${e.Location.lat}, ${e.Location.lng}`
      : e.Location || null
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/events");
      setEvents((response.data || []).map(normalizeEvent));
    } catch (apiErr) {
      console.error("Events API error:", apiErr);
      try {
        const response = await axios.get("http://localhost:5001/api/events/db");
        setEvents((response.data || []).map(normalizeEvent));
      } catch (dbErr) {
        console.error("DB fallback error:", dbErr);
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    setFilters({
      search: "",
    location: "",
    date: "",
    rating: 0,
    price: "",
    financialRange: ""
    });
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filters.search &&
        !event.EventName?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !event.Description?.toLowerCase().includes(filters.search.toLowerCase())
      ) return false;

      if (filters.location && !event.Location?.toLowerCase().includes(filters.location.toLowerCase())) return false;

      if (filters.date && event.Date && event.Date < filters.date) return false;

      if (filters.rating && (parseFloat(event.Rating) || 0) < filters.rating) return false;

      if (filters.price && event.Price && parseFloat(event.Price) > parseFloat(filters.price)) return false;

      if (filters.financialRange && filters.financialRange !== "" &&
        event.FinancialRange !== "N/A" &&
        event.FinancialRange !== filters.financialRange
      ) return false;

      return true;
    });
  }, [events, filters]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchValue }));
  }, [searchValue]);

  return (<>
    <div className="catigory-padding">
      <div className="search-form gap-2">
        <SearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          catigory={category}
        />
        <FilterBar onFilterClick={() => setIsFilterOpen(!isFilterOpen)} />
        {isFilterOpen && (
          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={setFilters}
          />
        )}
      </div>
      <div className="catigory-box">
        <section className="catigory-pages-layout">
          <div className="btn-gap">
            {loading ? (
              <div>Loading events...</div>
            ) : events.length === 0 ? (
              <div>No events available. Check server or API key.</div>
            ) : filteredEvents.length === 0 ? (
              <div>No events match the selected filters. Try clearing filters.</div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.EventID || event._id}
                  data={event}
                  onOpenPopup={openPopup}
                />
              ))
            )}
          </div>
          <DetailsPopup
            show={showPopup}
            item={selectedEvent}
            type="event"
            onClose={closePopup}
          />
        </section>
      </div>
    </div>
  </>);
}

export default EventPage;
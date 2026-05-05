import axios from "axios";
import RestaurantCard from "./RestaurantCard";
import SearchBar from "../../SearchBar";
import { useState, useEffect, useMemo } from "react";
import DetailsPopup from "../../DetailsPopup";
import FilterBar from "../../FilterBar";
import FilterPanel from "../FilterPanel/RestaurantFilterPanel";

function RestaurantsPage() {
  const category = "Restaurants";
  const [searchValue, setSearchValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    maxGuests: "",
    rating: 0,
    price: "",
    financialRange: ""
  });

  function openPopup(restaurant) {
    setSelectedRestaurant(restaurant);
    setShowPopup(true);
  }

  function closePopup() {
    setShowPopup(false);
    setSelectedRestaurant(null);
  }

  const normalizeRestaurant = (r) => ({
    ...r,
    Location: typeof r.Location === "object" && r.Location !== null
      ? `${r.Location.lat}, ${r.Location.lng}`
      : r.Location || null
  });

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/restaurants/db");
      setRestaurants((response.data || []).map(normalizeRestaurant));
    } catch (apiErr) {
      console.error("Restaurants API error:", apiErr);
      try {
        const response = await axios.get("http://localhost:5001/api/restaurants/db");
        setRestaurants((response.data || []).map(normalizeRestaurant));
      } catch (dbErr) {
        console.error("DB fallback error:", dbErr);
        setRestaurants([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    setFilters({
      search: "",
      location: "",
      maxGuests: "",
      rating: 0,
      price: "",
      financialRange: ""
    });
  }, []);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      if (filters.search &&
        !restaurant.RestaurantName?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !restaurant.Description?.toLowerCase().includes(filters.search.toLowerCase())
      ) return false;

      if (filters.location && !restaurant.Location?.toLowerCase().includes(filters.location.toLowerCase())) return false;

      if (filters.maxGuests && restaurant.MaxGuests !== "N/A" && parseInt(restaurant.MaxGuests) < parseInt(filters.maxGuests)) return false;

      if (filters.rating && (parseFloat(restaurant.Rating) || 0) < filters.rating) return false;

      if (filters.price && restaurant.Price && parseFloat(restaurant.Price) > parseFloat(filters.price)) return false;

      if (filters.financialRange && filters.financialRange !== "" &&
        restaurant.FinancialRange !== "N/A" &&
        restaurant.FinancialRange !== filters.financialRange
      ) return false;

      return true;
    });
  }, [restaurants, filters]);

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
              <div>Loading restaurants...</div>
            ) : restaurants.length === 0 ? (
              <div>No restaurants available. Check server.</div>
            ) : filteredRestaurants.length === 0 ? (
              <div>No restaurants match filters. Clear search.</div>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.RestaurantID}
                  data={restaurant}
                  onOpenPopup={openPopup}
                />
              ))
            )}
          </div>
          <DetailsPopup
            show={showPopup}
            item={selectedRestaurant}
            type="restaurant"
            onClose={closePopup}
          />
        </section>
      </div>
    </div>
  </>);
}

export default RestaurantsPage;
import HotelCard from "./HotelCard";
import SearchBar from "../../SearchBar";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import FilterPanel from "../FilterPanel/HotelFilterPanel";
import hotels_image from "../../../../../../images/hotels_image.png";
import DetailsPopup from "../../DetailsPopup";
import FilterBar from "../../FilterBar";

function HotelsPage() {
  const category = "Hotels";
  const [searchValue, setSearchValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    maxGuests: "",
    rating: 0,
    price: "",
    financialRange: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function openPopup(hotel) {
    setSelectedHotel(hotel);
    setShowPopup(true);
  }
  function closePopup() {
    setShowPopup(false);
    setSelectedHotel(null);
  }

  const normalizeHotel = (hotel) => ({
  ...hotel,
  location: typeof hotel.location === "object" && hotel.location !== null
    ? `${hotel.location.lat}, ${hotel.location.lng}`
    : hotel.location || null
});

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/hotels/google");
      setHotels((response.data || []).map(normalizeHotel));
    } catch (googleErr) {
      console.error("Google API error:", googleErr);
      try {
        const response = await axios.get("http://localhost:5001/api/hotels");
        setHotels((response.data || []).map(normalizeHotel));
      } catch (dbErr) {
        console.error("DB fallback error:", dbErr);
        setHotels([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
    setFilters({
      search: "",
      location: "",
      maxGuests: "",
      rating: 0,
      price: "",
      financialRange: ""
    });
  }, []);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const cleanPrice = hotel.price ? parseFloat(hotel.price.replace(/[^0-9.]/g, '')) : 0;
      const numPrice = isNaN(cleanPrice) ? 0 : cleanPrice;

      if (filters.search && !hotel.name?.toLowerCase().includes(filters.search.toLowerCase()) && !hotel.location?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.location && !hotel.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.maxGuests && hotel.maxGuests < parseInt(filters.maxGuests)) return false;
      if (filters.rating && (parseFloat(hotel.rating) || 0) < filters.rating) return false;
      if (filters.price && numPrice > parseFloat(filters.price)) return false;
      if (filters.financialRange) {
        let maxP = Infinity;
        if (filters.financialRange === "Affordable") maxP = 120;
        else if (filters.financialRange === "Moderate") maxP = 220;
        if (numPrice > maxP) return false;
      }
      return true;
    });
  }, [hotels, filters]);

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
              <div>Loading hotels...</div>
            ) : hotels.length === 0 ? (
              <div>No hotels available. Check server or API key.</div>
            ) : filteredHotels.length === 0 ? (
              <div>No hotels match the selected filters. Try clearing filters.</div>
            ) : (
              filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  data={hotel}
                  onOpenPopup={openPopup}
                />
              ))
            )}
          </div>
          <DetailsPopup
            show={showPopup}
            item={selectedHotel}
            type="hotel"
            onClose={closePopup}
          />
        </section>
      </div>
    </div>
  </>);
}

export default HotelsPage;
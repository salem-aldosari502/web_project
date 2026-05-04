import axios from "axios";
import RestaurantCard from "./RestaurantCard";
import SearchBar from "../SearchBar";
import { useState, useEffect, useMemo } from "react";
import DetailsPopup from "../../DetailsPopup";
import FilterBar from "../FilterBar";

function RestaurantsPage() {
    const category = "Restaurants";
    const [searchValue, setSearchValue] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const [filters, setFilters] = useState({
      search: "",
    });

    function openPopup(restaurant){
        setSelectedRestaurant(restaurant);
        setShowPopup(true);
    }

    function closePopup(){
        setShowPopup(false);
        setSelectedRestaurant(null);
    }

    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5001/api/restaurants");
        setRestaurants(response.data);
      } catch (err) {
        console.error("API error:", err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchRestaurants();
    }, []);

    const filteredRestaurants = useMemo(() => {
      return restaurants.filter((restaurant) => {
        if (filters.search && !restaurant.RestaurantName.toLowerCase().includes(filters.search.toLowerCase()) && !restaurant.Description.toLowerCase().includes(filters.search.toLowerCase())) return false;
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
        <FilterBar />
      </div>
      <div  className="catigory-box">
        <section className="catigory-pages-layout">
          <div className="btn-gap">
            {loading ? (
              <div>Loading restaurants...</div>
            ) : filteredRestaurants.length === 0 ? (
              <div>No restaurants found.</div>
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


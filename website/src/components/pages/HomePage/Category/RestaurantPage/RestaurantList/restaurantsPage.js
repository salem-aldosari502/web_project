import { restaurantsData } from "../../mockUpdata/RestaurantData";
import RestaurantCard from "./RestaurantCard";
import SearchBar from "../SearchBar";
import { useState } from "react";
import DetailsPopup from "../../DetailsPopup";
import FilterBar from "../FilterBar";


function RestaurantsPage() {
    const [searchValue, setSearchValue] = useState("");
    const catigory = "Restaurants";
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    function openPopup(hotel){
        setSelectedRestaurant(hotel);
        setShowPopup(true);
    }

    function closePopup(){
        setShowPopup(false);
        setSelectedRestaurant(null);
    }


    return (<>
    <div className="catigory-padding">
      <dive className="search-form gap-2">
        <SearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          catigory={catigory}
        />
        <FilterBar />
      </dive>
      <div  className="catigory-box">
        <section className="catigory-pages-layout">
          <div className="btn-gap">
            {restaurantsData.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                data={restaurant}
                onOpenPopup={openPopup}
              />
            ))}
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


export default RestaurantsPage
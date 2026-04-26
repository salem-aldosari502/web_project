import { hotelsData } from "../../mockUpdata/HotelData"
import HotelCard from "./HotelCard";
import SearchBar from "../SearchBar";
import { useState } from "react";
import DetailsPopup from "../../DetailsPopup";
import FilterBar from "../FilterBar";


function HotelsPage() {
  const catigory = "Hotels";
  const [searchValue, setSearchValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  function openPopup(hotel){
    setSelectedHotel(hotel);
    setShowPopup(true);
  }

  function closePopup(){
    setShowPopup(false);
    setSelectedHotel(null);
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
            {hotelsData.map((hotel) => (
              <HotelCard
                key={hotel.id}
                data={hotel}
                onOpenPopup={openPopup}
              />
            ))}
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

export default HotelsPage

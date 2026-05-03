import { eventsData } from "../../mockUpdata/EventData";
import EventCard from "./EventCard";
import SearchBar from "../SearchBar";
import { useState } from "react";
import DetailsPopup from "../../DetailsPopup";
import FilterBar from "../FilterBar";


function EventPage() {
    const [searchValue, setSearchValue] = useState("");
    const catigory = "Events";
    const [showPopup, setShowPopup] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    function openPopup(hotel){
        setSelectedEvent(hotel);
        setShowPopup(true);
    }

    function closePopup(){
        setShowPopup(false);
        setSelectedEvent(null);
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
            {eventsData.map((event) => (
              <EventCard
                key={event.id}
                data={event}
                onOpenPopup={openPopup}
              />
            ))}
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

export default EventPage
import events_image from "../../../../../../images/events_image.png"

function EventCard({ data, onOpenPopup }) {
  return (<>
    <butoon type="button" className="category-btn" onClick={()=> onOpenPopup(data)}>
        <div className="catigory-item">
        <img src={events_image} alt="event_image" width={200} height={100} />
        <div className="item-info">
            <p className="item-title">{data.name}</p>
            <p className="item-description">Description</p>
        </div>

            <div className="item-btn">
            <button id="gap"
                type="text" 
                className="pr-btn"
                onClick={() => onOpenPopup(data)}
            >
                Details
            </button>
            </div>
        </div>
    </butoon>
  </>);
}

export default EventCard
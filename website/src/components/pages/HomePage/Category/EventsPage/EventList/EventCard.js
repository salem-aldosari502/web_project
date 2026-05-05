import events_image from "../../../../../../images/events_image.png";

function EventCard({ data, onOpenPopup }) {
  return (<>
    <button type="button" className="catigory-card" onClick={() => onOpenPopup(data)}>
      <div className="catigory-item">
        <img src={data.image || events_image} alt={data.EventName} width={200} height={100} />
        <div style={{ color: "white" }}>
          <p>{data.EventName || 'N/A'}</p>
          <p>{data.Description || ''}</p>
        </div>
        <div className="item-btn">
          <button
            type="button"
            className="pr-btn"
            onClick={(e) => { e.stopPropagation(); onOpenPopup(data); }}
          >
            Details
          </button>
          {data.Link && (
            <button className="pr-btn"
              onClick={(e) => { e.stopPropagation(); window.open(data.Link, "_blank"); }}
            >
              Visit Event Site
            </button>
          )}
        </div>
      </div>
    </button>
  </>);
}

export default EventCard;
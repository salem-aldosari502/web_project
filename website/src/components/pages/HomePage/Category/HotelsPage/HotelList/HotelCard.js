import hotels_image from "../../../../../../images/hotels_image.png";

function HotelCard({ data, onOpenPopup }) {
  const location = typeof data.location === "object" && data.location !== null
    ? data.address || `${data.location.lat}, ${data.location.lng}`
    : data.location || 'N/A';

  return (<>
    <button type="button" className="catigory-card" onClick={() => onOpenPopup(data)}>
      <div className="catigory-item">
        <img src={data.image || hotels_image} alt={data.name} width={200} height={100} />
        <div style={{ color: "white" }}>
          <p>{data.name || 'N/A'}</p>
          <p>⭐ {data.rating || 'N/A'}</p>
          <p>{data.price || 'N/A'}</p>
          <p>{location}</p>
        </div>
        <div className="item-btn">
          <button type="button" className="pr-btn" onClick={(e) => { e.stopPropagation(); onOpenPopup(data); }}>
            Details
          </button>
          {data.link && (
            <button className="pr-btn" onClick={(e) => { e.stopPropagation(); window.open(data.link, "_blank"); }}>
              Visit Hotel Site
            </button>
          )}
        </div>
      </div>
    </button>
  </>);
}

export default HotelCard;
import hotels_image from "../../../../../../images/hotels_image.png"

function HotelCard({ data, onOpenPopup }) {
  return (<>
    <button type="button" className="catigory-box" onClick={() => onOpenPopup(data)}>
        <div className="catigory-item">
          <img src={data.image || hotels_image} alt={data.name} width={200} height={100} style={{}}/>
          <div style={{color: "white"}}>
            <p>{data.name}</p>
            <p>⭐ {data.rating || 'N/A'}</p>
            <p>{data.price || 'N/A'}</p>
            <p>{data.location || 'N/A'}</p>
          </div>

          <div className="item-btn">
            <button type="button" className="pr-btn"onClick={(e) => {e.stopPropagation(); onOpenPopup(data);}}>
              Details
            </button>
            {data.link && (
              <button className="pr-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(data.link, "_blank");
                }}>
                View on Hotel Site
              </button>
            )}
          </div>
        </div>
    </button>
  </>);
}

export default HotelCard
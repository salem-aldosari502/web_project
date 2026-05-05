import restaurants_image from "../../../../../../images/restaurants_image.png";

function RestaurantCard({ data, onOpenPopup }) {
  return (<>
    <button type="button" className="catigory-card" onClick={() => onOpenPopup(data)}>
      <div className="catigory-item">
        <img src={data.image || restaurants_image} alt={data.RestaurantName} width={200} height={100} />
        <div style={{ color: "white" }}>
          <p>{data.RestaurantName || 'N/A'}</p>
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
          {data.link && (
            <button className="pr-btn"
              onClick={(e) => { e.stopPropagation(); window.open(data.link, "_blank"); }}
            >
              Visit Restaurant Site
            </button>
          )}
        </div>
      </div>
    </button>
  </>);
}

export default RestaurantCard;
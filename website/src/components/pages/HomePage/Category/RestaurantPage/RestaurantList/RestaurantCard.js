import restaurants_image from "../../../../../../images/restaurants_image.png"

function RestaurantCard({ data, onOpenPopup }) {
  return (<>
    <button type="button" className="category-btn" onClick={() => onOpenPopup(data)}>
      <div className="catigory-item">
        <img src={data.image || restaurants_image} alt="restaurant_image" width={200} height={100} />
        <div className="item-info">
          <p className="item-title">{data.RestaurantName}</p>
          <p className="item-description">{data.Description}</p>
          <p>⭐ {data.Rating} | ${data.Price} | {data.FinancialRange}</p>
        </div>

          <div className="item-btn">
            <button 
              type="button" 
              className="pr-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenPopup(data);
              }}
            >
              Details
            </button>
          </div>
      </div>
    </button>
  </>);
}

export default RestaurantCard
import { createPortal } from "react-dom";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import hotels_image from "../../../../images/hotels_image.png";
import restaurants_image from "../../../../images/restaurants_image.png";
import events_image from "../../../../images/events_image.png";

function DetailsPopup({ show, item, type, onClose }) {
  if (!show || !item) return null;

  const name = item.name || item.HotelName || item.RestaurantName || item.EventName || "N/A";
  const image = item.image ||
    (type === "restaurant" ? restaurants_image :
     type === "event" ? events_image : hotels_image);

  const rawLocation = item.location || item.Location || null;
  const location = typeof rawLocation === "object" && rawLocation !== null
    ? `${rawLocation.lat}, ${rawLocation.lng}`
    : rawLocation || null;

  return createPortal(
    <div className="description-popup-overlay">
      <div className="description-popup">
        <button className="description-popup-close" onClick={onClose}>×</button>

        <img src={image} alt={name} className="description-popup-image" />

        <h4>{name}</h4>

        <ul className="description-popup-info">
          {location && <li><strong>Location:</strong> {location}</li>}

          {(item.Rating || item.rating) &&
            <li><strong>Rating:</strong> ⭐ {item.Rating || item.rating}</li>}

          {(item.Description || item.description) &&
            <li><strong>Description:</strong> {item.Description || item.description}</li>}

          {(item.Price || item.price) &&
            <li><strong>Price:</strong> {item.Price || item.price} KD</li>}

          {(item.FinancialRange || item.financialRange) &&
            (item.FinancialRange || item.financialRange) !== "N/A" &&
            <li><strong>Financial Range:</strong> {item.FinancialRange || item.financialRange}</li>}

          {(item.MaxGuests || item.maxGuests) &&
            (item.MaxGuests || item.maxGuests) !== "N/A" &&
            <li><strong>Max Guests:</strong> {item.MaxGuests || item.maxGuests}</li>}

          {type === "event" && (item.Address || item.address) && (
            <li><strong>Address:</strong> {item.Address || item.address}</li>
          )}
          {type === "event" && item.Date && (
            <li><strong>Date:</strong> {item.Date}</li>
          )}
          {type === "event" && item.Time && (
            <li><strong>Time:</strong> {item.Time}</li>
          )}
        </ul>

        <Nav.Link as={Link} to='/reviewpage' type="button" className="pr-btn">
          Add a Review
        </Nav.Link>
      </div>
    </div>,
    document.body
  );
}

export default DetailsPopup;
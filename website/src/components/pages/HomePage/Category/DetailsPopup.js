import { createPortal } from "react-dom";

function DetailsPopup({ show, item, type, onClose }) {
  if (!show || !item) return null;

  return createPortal(
    <div className="description-popup-overlay">
      <div className="description-popup">
        <button className="description-popup-close" onClick={onClose}>
          ×
        </button>

        <img
          src={item.image}
          alt={item.name}
          className="description-popup-image"
        />

        <h4>{item.name}</h4>

        <ul className="description-popup-info">
          {item.location && <li><strong>Location:</strong> {item.location}</li>}
          {item.rating && <li><strong>Rating:</strong> {item.rating}</li>}
          {item.description && <li><strong>Description:</strong> {item.description}</li>}

          {type === "hotel" && item.price && (
            <li><strong>Price:</strong> {item.price} KD</li>
          )}

          {type === "restaurant" && item.financialRange && (
            <li><strong>Financial Range:</strong> {item.financialRange}</li>
          )}

          {type === "event" && item.date && (
            <li><strong>Date:</strong> {item.date}</li>
          )}

          {type === "event" && item.time && (
            <li><strong>Time:</strong> {item.time}</li>
          )}

          {item.maxGuests && (
            <li><strong>Max Guests:</strong> {item.maxGuests}</li>
          )}
        </ul>

        <button type="button" className="pr-btn" onClick={onClose}>
          Reviewed
        </button>
      </div>
    </div>,
    document.body
  );
}

export default DetailsPopup;
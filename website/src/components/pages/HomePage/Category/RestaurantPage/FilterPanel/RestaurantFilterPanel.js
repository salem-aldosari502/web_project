import { Form, Container, Row, Col } from "react-bootstrap";

const RestaurantFilterPanel = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  const updateFilter = (key, value) => {
    onFilterChange(prev => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    onFilterChange({
      search: filters.search || "",
      location: "",
      rating: 0,
      price: "",
      financialRange: ""
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h5>🔍 Filter Restaurants</h5>
        <button className="filter-close-btn" onClick={onClose}>✕</button>
      </div>

      <Container fluid className="px-0">
        <Row className="mb-3">
          <Col>
            <Form.Label className="filter-label">Location</Form.Label>
            <Form.Control
              className="filter-input"
              type="text"
              placeholder="e.g. Salmiya"
              value={filters.location || ''}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label className="filter-label">Max Price (KD)</Form.Label>
            <Form.Control
              className="filter-input"
              type="number"
              placeholder="e.g. 20"
              value={filters.price || ''}
              onChange={(e) => updateFilter('price', e.target.value)}
            />
          </Col>
          <Col>
            <Form.Label className="filter-label">Min Rating</Form.Label>
            <Form.Select
              className="filter-input"
              value={filters.rating || 0}
              onChange={(e) => updateFilter('rating', parseFloat(e.target.value))}
            >
              <option value={0}>Any</option>
              <option value={3.0}>3.0+</option>
              <option value={4.0}>4.0+</option>
              <option value={4.5}>4.5+</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label className="filter-label">Financial Range</Form.Label>
            <Form.Select
              className="filter-input"
              value={filters.financialRange || ''}
              onChange={(e) => updateFilter('financialRange', e.target.value)}
            >
              <option value="">Any</option>
              <option value="Affordable">Affordable</option>
              <option value="Moderate">Moderate</option>
              <option value="Expensive">Expensive</option>
            </Form.Select>
          </Col>
        </Row>

        <div className="filter-actions">
          <button className="filter-apply-btn" onClick={onClose}>Apply</button>
          <button className="filter-clear-btn" onClick={clearAll}>Clear All</button>
        </div>
      </Container>

      <style>{`
        .filter-panel {
          position: fixed;
          top: 20%;
          right: 5%;
          background: rgba(15, 23, 42, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 1000;
          min-width: 320px;
        }
        .filter-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 12px;
        }
        .filter-panel-header h5 { color: white; margin: 0; font-weight: 600; font-size: 1rem; }
        .filter-close-btn { background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 0.8rem; transition: background 0.2s; }
        .filter-close-btn:hover { background: rgba(255,255,255,0.2); }
        .filter-label { color: rgba(255,255,255,0.75) !important; font-size: 0.82rem; margin-bottom: 6px; font-weight: 500; }
        .filter-input { background: rgba(255,255,255,0.08) !important; border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 10px !important; color: white !important; font-size: 0.88rem; padding: 8px 12px; }
        .filter-input:focus { border-color: #f97316 !important; box-shadow: 0 0 0 2px rgba(249,115,22,0.25) !important; outline: none; }
        .filter-input option { background: #0f172a; color: white; }
        .filter-input::placeholder { color: rgba(255,255,255,0.35); }
        .filter-actions { display: flex; gap: 10px; margin-top: 8px; }
        .filter-apply-btn { flex: 1; background: #f97316; border: none; color: white; border-radius: 10px; padding: 9px; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: background 0.2s; }
        .filter-apply-btn:hover { background: #ea6c0a; }
        .filter-clear-btn { flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.75); border-radius: 10px; padding: 9px; font-size: 0.88rem; cursor: pointer; }
        .filter-clear-btn:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
};

export default RestaurantFilterPanel;
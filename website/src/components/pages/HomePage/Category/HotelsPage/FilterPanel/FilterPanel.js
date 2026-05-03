import { Form, Button, Container, Row, Col } from "react-bootstrap";

const FilterPanel = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  const updateFilter = (key, value) => {
    onFilterChange(prev => ({...prev, [key]: value}));
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h5>Filters</h5>
        <Button size="sm" onClick={onClose} variant="outline-secondary">Close</Button>
      </div>
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Form.Label style={{color: "black"}}>Location</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="e.g. Salmiya"
              value={filters.location || ''} 
              onChange={(e) => updateFilter('location', e.target.value)} 
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Label style={{color:"black"}}>Max Guests</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="e.g. 4"
              value={filters.maxGuests || ''} 
              onChange={(e) => updateFilter('maxGuests', e.target.value)} 
            />
          </Col>
          <Col>
            <Form.Label style={{color:"black"}}>Max Price</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="e.g. 200"
              value={filters.price || ''} 
              onChange={(e) => updateFilter('price', e.target.value)} 
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Label style={{color:"black"}}>Min Rating</Form.Label>
            <Form.Select value={filters.rating || 0} onChange={(e) => updateFilter('rating', parseFloat(e.target.value))}>
              <option value={0}>Any</option>
              <option value={3.0}>3.0+</option>
              <option value={4.0}>4.0+</option>
              <option value={4.5}>4.5+</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Label style={{color:"black"}}>Financial Range</Form.Label>
            <Form.Select value={filters.financialRange || ''} onChange={(e) => updateFilter('financialRange', e.target.value)}>
              <option value="">Any</option>
              <option value="Affordable">Affordable ($120)</option>
              <option value="Moderate">Moderate ($220)</option>
              <option value="Expensive">Expensive</option>
            </Form.Select>
          </Col>
        </Row>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={onClose} size="sm">Apply</Button>
          <Button variant="outline-secondary" onClick={() => onFilterChange({})} size="sm">Clear All</Button>
        </div>
      </Container>

      <style jsx>{`
        .filter-panel {
          position: fixed;
          top: 20%;
          right: 10%;
          background: white;
          border: 2px solid #ddd;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          z-index: 1000;
          min-width: 300px;
        }
        .filter-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .filter-header h5 {
          color: black;
          margin: 0;
        }
        .label {
          color: black;
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;

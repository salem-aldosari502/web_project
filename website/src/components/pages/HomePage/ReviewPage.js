import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

function ReviewPage() {
  const [formData, setFormData] = useState({
    title: '',
    reviewText: '',
    rating: 0
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();
  const { auth, getToken } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: '' });
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleStarHoverOut = () => {
    setHoverRating(0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Review title is required';
    if (!formData.reviewText.trim()) newErrors.reviewText = 'Review text is required';
    if (formData.rating === 0) newErrors.rating = 'Please select a rating';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;

    if (!auth?.id) {
      setSubmitError('Please log in to submit a review');
      return;
    }
    
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          UserID: auth.id,
          Evaluate: formData.rating,
          Rating: 0, // Default for hotel/etc, can be context-specific later
          Comment: `${formData.title}: ${formData.reviewText}`
        })
      });

      if (response.ok) {
        setSuccess(true);
        alert('Review submitted successfully! Thank you for your feedback!');
        setFormData({ title: '', reviewText: '', rating: 0 });
        setHoverRating(0);
      } else {
        const err = await response.json();
        setSubmitError(err.message || 'Failed to submit review');
      }
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          alert('⚠️ Server is currently offline. Please try again later.');
      } else {
        setSubmitError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <div className="background-layer"></div>
        <div className="login-card" style={{ maxWidth: '500px', margin: '100px auto' }}>
          <h2>Review Submitted!</h2>
          <p>Thank you for sharing your experience!</p>
          <div style={{ fontSize: '2.5rem', color: '#ff7a00', margin: '30px 0', display: 'flex', justifyContent: 'center' }}>
            {[1,2,3,4,5].map((star) => (
              <FaStar 
                key={star} 
                style={{ marginRight: '5px' }}
              />
            ))}
          </div>
          <Button 
            variant="primary" 
            onClick={() => {
              setSuccess(false);
              navigate(-1);
            }}
            style={{ background: '#ff7a00', border: 'none', width: '100%' }}
            className="mb-3"
          >
            Back to Listing
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="background-layer"></div>
      <section className="signup" style={{width: "80%"}}>
        <div className="contact-card">
          <h2>Share Your Review</h2>
          <p>Tell us about your experience</p>
          
          <Form onSubmit={handleSubmit} className="contact-form" style={{width: "90%"}}>
            <Form.Group className="mb-3">
              <Form.Label>Review Title</Form.Label>
              <Form.Control 
                type="text"
                name="title"
                placeholder="e.g. Amazing Information and Service!"
                value={formData.title}
                onChange={handleChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                {[1,2,3,4,5].map((star) => (
                  <FaStar
                    key={star}
                    size={30}
                    color={star <= (hoverRating || formData.rating) ? '#ff7a00' : '#666'}
                    style={{
                      cursor: 'pointer',
                      marginRight: '8px',
                      transition: 'color 0.2s ease'
                    }}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarHoverOut}
                  />
                ))}
              </div>
              {errors.rating && (
                <div className="text-danger" style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                  {errors.rating}
                </div>
              )}
              <small className="text-white-50">
                {formData.rating ? `You rated ${formData.rating}/5 stars` : 'Click a star to rate'}
              </small>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Your Review</Form.Label>
              <Form.Control 
                as="textarea"
                rows={5}
                name="reviewText"
                placeholder="Share your detailed experience..."
                value={formData.reviewText}
                onChange={handleChange}
                isInvalid={!!errors.reviewText}
              />
              <Form.Control.Feedback type="invalid">
                {errors.reviewText}
              </Form.Control.Feedback>
            </Form.Group>

            {submitError && (
              <Alert variant="danger" className="mb-3">{submitError}</Alert>
            )}
            <Button 
              variant="primary" 
              type="submit"
              style={{ background: '#ff7a00', border: 'none', width: '110%' }}
              disabled={formData.rating === 0 || loading}
              className="mb-3"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Button 
              variant="outline-light"
              onClick={() => navigate(-1)}
              style={{ 
                color: '#ff7a00', 
                border: '2px solid #ff7a00',
                width: '100%',
                borderRadius: '12px'
              }}
            >
              ← Back to Listing
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default ReviewPage;  
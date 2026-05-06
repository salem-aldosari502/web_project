import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function StarRating({ value, hover, onRate, onHover, onLeave }) {
  return (
    <div style={{ display: 'flex', gap: 6, margin: '8px 0' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRate(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onLeave}
          style={{
            fontSize: 32,
            cursor: 'pointer',
            color: star <= (hover || value) ? '#000' : '#ccc',
            transition: 'color 0.15s',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, getToken } = useAuth();

  const itemState = location.state || {};
  const itemType = itemState.itemType || 'general';
  const itemId   = itemState.itemId   || '';
  const itemName = itemState.itemName || '';

  const [formData, setFormData] = useState({ title: '', reviewText: '', rating: 0 });
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // Redirect to login if not authenticated — keep return path
  useEffect(() => {
    if (!auth?.id) {
      navigate('/login', { state: { returnTo: '/reviewpage', returnState: itemState } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.id]);

  if (!auth?.id) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title.trim()) { setError('Please add a title.'); return; }
    if (!formData.reviewText.trim()) { setError('Please write your review.'); return; }
    if (!formData.rating) { setError('Please select a star rating.'); return; }

    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          UserID:   auth.id,
          Evaluate: formData.rating,
          Rating:   formData.rating,
          title:    formData.title.trim(),
          Comment:  formData.reviewText.trim(),
          itemType,
          itemId,
          itemName,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.message || 'Failed to submit review.');
        return;
      }
      setDone(true);
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>
            {'★'.repeat(formData.rating)}
          </div>
          <h2 style={styles.heading}>Review Submitted!</h2>
          <p style={styles.sub}>Thank you for sharing your experience{itemName ? ` with ${itemName}` : ''}.</p>
          <button style={styles.btnPrimary} onClick={() => navigate(-1)}>
            ← Back to Listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Write a Review</h2>
        {itemName && (
          <p style={styles.sub}>
            <span style={styles.tag}>{itemType}</span> {itemName}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              placeholder="e.g. Great experience!"
              value={formData.title}
              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Rating</label>
            <StarRating
              value={formData.rating}
              hover={hover}
              onRate={(r) => setFormData(p => ({ ...p, rating: r }))}
              onHover={setHover}
              onLeave={() => setHover(0)}
            />
            <small style={{ color: '#888', fontSize: 13 }}>
              {formData.rating ? `${formData.rating} / 5 stars` : 'Click a star to rate'}
            </small>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Your Review</label>
            <textarea
              rows={5}
              placeholder="Share your detailed experience..."
              value={formData.reviewText}
              onChange={(e) => setFormData(p => ({ ...p, reviewText: e.target.value }))}
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </div>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.btnSecondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.rating}
              style={{
                ...styles.btnPrimary,
                opacity: (loading || !formData.rating) ? 0.6 : 1,
                cursor: (loading || !formData.rating) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
    background: '#f8f9fa',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  card: {
    background: '#fff',
    border: '1px solid #dee2e6',
    borderRadius: 24,
    padding: '36px 40px',
    maxWidth: 540,
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
  },
  heading: {
    margin: '0 0 6px',
    fontSize: 26,
    fontWeight: 800,
    color: '#000',
  },
  sub: {
    margin: '0 0 24px',
    fontSize: 14,
    color: '#6c757d',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    background: '#000',
    color: '#fff',
    borderRadius: 99,
    padding: '2px 10px',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 18,
  },
  label: {
    fontWeight: 700,
    fontSize: 14,
    color: '#212529',
    marginBottom: 6,
  },
  input: {
    border: '1px solid #dee2e6',
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 15,
    color: '#000',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    background: '#fff',
  },
  error: {
    background: '#FBE9E9',
    color: '#9C2A2A',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    marginTop: 12,
  },
  btnPrimary: {
    flex: 1,
    padding: '13px 20px',
    borderRadius: 14,
    border: 'none',
    background: '#000',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    transition: '0.2s',
  },
  btnSecondary: {
    flex: 1,
    padding: '13px 20px',
    borderRadius: 14,
    border: '1px solid #dee2e6',
    background: '#fff',
    color: '#000',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
  },
};

export default ReviewPage;

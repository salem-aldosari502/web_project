import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return (
      <section className="login-card profile-card">
        <div className="profile-container">
          <h2>Profile</h2>
          <p>No user data found. Please sign up or log in.</p>
          <button onClick={() => navigate('/signup')} className="pr-btn">
            Sign Up
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="login-card profile-card">
      <div className="profile-container">
        <h2>My Profile</h2>
        <div className="profile-info">
          <div className="profile-info-row">
            <span className="profile-label">First Name:</span>
            <span className="profile-value">{user.firstName || 'N/A'}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-label">Last Name:</span>
            <span className="profile-value">{user.lastName || 'N/A'}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{user.email || 'N/A'}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-label">Birthdate:</span>
            <span className="profile-value">{user.birthdate || 'N/A'}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-label">Gender:</span>
            <span className="profile-value">
              <div className="form-check" style={{ display: 'flex', gap: '30px' }}>
                <label className="form-check-label" style={{ color: 'white' }}>
                  <input
                    type="radio"
                    name="profileGender"
                    value="Male"
                    checked={user.gender === 'Male'}
                    readOnly
                    className="form-check-input"
                  /> Male  
                </label>
                <label className="form-check-label" style={{ color: 'white' }}>
                  <input
                    type="radio"
                    name="profileGender"
                    value="Female"
                    checked={user.gender === 'Female'}
                    readOnly
                    className="form-check-input"
                  /> Female
                </label>
              </div>
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="pr-btn" style={{ marginTop: '30px' }}>
          Logout
        </button>
      </div>
    </section>
  );
}

export default ProfilePage;

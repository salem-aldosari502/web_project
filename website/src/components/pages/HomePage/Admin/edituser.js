import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './edituser.css';

function EditUser() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Updated user:', formData);
    alert('User updated successfully');
  };

  return (
    <div className="ud-page">
      <div className="ud-shell">
        <div className="ud-header">
          <div>
            <span className="ud-badge">Admin Panel</span>
            <h1>Edit User</h1>
            <p>Modify user account details and permissions.</p>
          </div>
          <Link to="/admin" className="ud-back-btn">← Back to Dashboard</Link>
        </div>

        <div className="ud-card">
          <div className="ud-card-top">
            <div>
              <h2>User Information</h2>
              <span>Update account details below</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="sm-grid">
              <div className="sm-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm-field">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm-field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm-field sm-field-full">
                <label>Gender</label>
                <div className="ud-gender-group">
                  <label className="ud-radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                    />
                    <span className="ud-radio-custom"></span>
                    Male
                  </label>
                  <label className="ud-radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleChange}
                    />
                    <span className="ud-radio-custom"></span>
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="sm-actions">
              <Link to="/admin" className="sm-btn sm-btn-secondary">Cancel</Link>
              <button type="submit" className="sm-btn sm-btn-primary">Update User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
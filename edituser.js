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
    <div className="edituser-page">
      <div className="edituser-container">
        <Link to="/" className="edituser-back-btn">
          ← Back to Dashboard
        </Link>

        <div className="edituser-title">Edit User</div>

        <div className="edituser-content">
          <form onSubmit={handleSubmit}>
            <div className="edituser-user-details">
              <div className="edituser-input-box">
                <span className="edituser-details">Full Name</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="edituser-input-box">
                <span className="edituser-details">Username</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="edituser-input-box">
                <span className="edituser-details">Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="edituser-input-box">
                <span className="edituser-details">Phone Number</span>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="edituser-input-box">
                <span className="edituser-details">Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="edituser-input-box">
                <span className="edituser-details">Confirm Password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="edituser-gender-details">
              <input
                type="radio"
                name="gender"
                id="edituser-dot-1"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
              />
              <input
                type="radio"
                name="gender"
                id="edituser-dot-2"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
              />
              <input
                type="radio"
                name="gender"
                id="edituser-dot-3"
                value="Prefer not to say"
                checked={formData.gender === 'Prefer not to say'}
                onChange={handleChange}
              />

              <span className="edituser-gender-title">Gender</span>

              <div className="edituser-category">
                <label htmlFor="edituser-dot-1">
                  <span className="edituser-dot one"></span>
                  <span className="edituser-gender">Male</span>
                </label>

                <label htmlFor="edituser-dot-2">
                  <span className="edituser-dot two"></span>
                  <span className="edituser-gender">Female</span>
                </label>

                <label htmlFor="edituser-dot-3">
                  <span className="edituser-dot three"></span>
                  <span className="edituser-gender">Prefer not to say</span>
                </label>
              </div>
            </div>

            <div className="edituser-button">
              <input type="submit" value="Update User" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
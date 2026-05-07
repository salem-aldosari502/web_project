import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthdate: '',
    phone: ''
  });
  const [phoneDigits, setPhoneDigits] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handlePhoneDigits = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneDigits(value);
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors(prevErrors => ({ ...prevErrors, phone: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email || !formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Valid email is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.gender) newErrors.gender = 'Please select a gender';

    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate + 'T00:00:00');
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (birthDate.getFullYear() < 1900 || age < 13) {
        newErrors.birthdate = 'Please enter a valid birthdate (must be at least 13 years old)';
      }
    } else {
      newErrors.birthdate = 'Birthdate is required';
    }

    if (!formData.phone || formData.phone.length !== 8) {
      newErrors.phone = 'Phone must be exactly 8 digits';
    }

    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userData = {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        password: formData.password,
        birth: formData.birthdate,
        gender: formData.gender,
        phone: formData.phone,
        role: 'user'
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      setSuccess(true);
      alert('Signup successful! Welcome, ' + formData.firstName + ' ' + formData.lastName + '!');
      setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', gender: '', birthdate: '', phone: '' });
      setPhoneDigits('');
      navigate('/login');
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        alert('⚠️ Server is currently offline. Please try again later.');
      } else {
        alert('Signup failed: ' + error.message);
      }
    }
  };

  if (success) {
    return (
      <div className="signup-success">
        <h2>Account Created Successfully!</h2>
        <p>You can now log in with your credentials.</p>
        <button onClick={() => setSuccess(false)}>Create Another Account</button>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <section className="signup-card">

        <div className="signup-card-accent">
          <span className="signup-card-accent-dot" />
          <span>Join Us</span>
          <span className="signup-card-accent-dot" />
          <span>Create Your Account</span>
          <span className="signup-card-accent-dot" />
        </div>

        <div className="signup-container">
          <h2>Create Your Account</h2>
          <p>Fill in your details below to get started</p>

          <form onSubmit={handleSubmit} className="login-form">

            <div className="signup-name-row">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <span className="signup-error">{errors.firstName}</span>}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <span className="signup-error">{errors.lastName}</span>}
              </div>
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="signup-error">{errors.email}</span>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password (min 8 chars)"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="signup-error">{errors.password}</span>}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="signup-error">{errors.confirmPassword}</span>}
            </div>

            <div className="signup-field-group">
              <label className="signup-label">Gender:</label>
              <div className="signup-gender-row">
                <label className="form-check-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleChange}
                    className="form-check-input"
                  /> Male
                </label>
                <label className="form-check-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleChange}
                    className="form-check-input"
                  /> Female
                </label>
              </div>
              {errors.gender && <span className="signup-error">{errors.gender}</span>}
            </div>

            <div className="signup-field-group">
              <label className="signup-label">Birthdate:</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="signup-date-input"
              />
              {errors.birthdate && <span className="signup-error">{errors.birthdate}</span>}
            </div>

            <div>
              <div className="signup-phone-row">
                <span className="signup-phone-prefix">+965</span>
                <input
                  type="tel"
                  name="phoneDigits"
                  placeholder="xxxxxxxx"
                  value={phoneDigits}
                  onChange={handlePhoneDigits}
                  maxLength="8"
                  pattern="[0-9]{8}"
                />
              </div>
              {errors.phone && <span className="signup-error">{errors.phone}</span>}
            </div>

            <button type="submit">Sign Up</button>
          </form>

          <p className="signup-login-link">
            Already have an account?{' '}
            <a href="/login">Login here</a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
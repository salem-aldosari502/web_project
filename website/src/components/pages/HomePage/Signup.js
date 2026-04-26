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
    birthdate: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.gender) newErrors.gender = 'Please select a gender';
    if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    localStorage.setItem('user', JSON.stringify(formData));
    setSuccess(true);
    alert('Signup successful! Welcome, ' + formData.firstName + ' ' + formData.lastName + '!');
    setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', gender: '', birthdate: '' });
    navigate('/login');
  };

  if (success) {
    return (
      <div className="signup-success">
        <h2>Account Created Successfully!</h2>
        <p>You can now log in with your credentials.</p>
        <button onClick={() => setSuccess(false)}>
          Create Another Account
        </button>
      </div>
    );
  }

  return (<>

    <section className='login-card'>
        <div className="signup-container">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} className='login-form'>
            <div>
            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
            />
            {errors.firstName && <span style={{ color: 'red', fontSize: '14px', display: 'block' }}>{errors.firstName}</span>}
            </div>
            <div>
            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
            />
            {errors.lastName && <span style={{ color: 'red', fontSize: '14px', display: 'block' }}>{errors.lastName}</span>}
            </div>
            <div style={{ marginBottom: '15px' }}>
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
            />
            {errors.email && <span style={{ color: 'red', fontSize: '14px', display: 'block' }}>{errors.email}</span>}
            </div>
            <div style={{ marginBottom: '15px' }}>
            <input
                type="password"
                name="password"
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
            />
            {errors.password && <span style={{ color: 'red', fontSize: '14px', display: 'block' }}>{errors.password}</span>}
            </div>
            <div style={{ marginBottom: '20px' }}>
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
            />
            {errors.confirmPassword && <span style={{ color: 'red', fontSize: '14px', display: 'block' }}>{errors.confirmPassword}</span>}
            </div>
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px' }}>Gender:</label>
              <div className="form-check" style={{ display: 'flex', gap: '20px' }}>
                <label className="form-check-label" style={{ color: 'white' }}>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleChange}
                    className="form-check-input"
                  /> Male
                </label>
                <label className="form-check-label" style={{ color: 'white' }}>
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
              {errors.gender && <span style={{ color: 'red', fontSize: '14px', display: 'block' }}>{errors.gender}</span>}
            </div>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px' }}>Birthdate:</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '1rem' }}
              />
              {errors.birthdate && <span style={{ color: 'red', fontSize: '14px', display: 'block' }}>{errors.birthdate}</span>}
            </div>
            <button 
            type="submit">
            Sign Up
            </button>
        </form>
        <p>
            Already have an account? <a href="/login" style={{ color: '#007bff' }}>Login here</a>
        </p>
        </div>
    </section>
  </>);
}

export default SignUp;

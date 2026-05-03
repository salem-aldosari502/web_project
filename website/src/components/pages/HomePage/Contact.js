
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Alert from 'react-bootstrap/Alert';

function ContactUs(){
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { auth, getToken } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const body = {
        Name: formData.name,
        Email: formData.email,
        Message: formData.message
      };
      if (auth?.id) {
        body.UserID = auth.id;
      }

      const response = await fetch('http://localhost:5001/api/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setSuccess('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to send message');
      }
    } catch (err) {
        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          alert('⚠️ Server is currently offline. Please try again later.');
        } else {
          setError('An unexpected error occurred.');
        }
    } finally {
      setLoading(false);
    }
  };

  return(<>
      <div className="background-layer"></div>
  
        <section className="contact">
          <div className="contact-card">
            <h2>Contact Us</h2>
            <p>You can send us a message:</p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Name" 
                value={formData.name}
                onChange={handleChange}
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
              />
              <textarea 
                name="message"
                placeholder="Write your message..." 
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
          </div>
        </section>
    </>);
 }

export default ContactUs;

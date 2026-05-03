import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sendmessage.css';

function SendMessage() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
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
    console.log('Send message:', formData);
    alert('Message sent successfully');

    setFormData({
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="sm-page">
      <div className="sm-shell">
        <div className="sm-header">
          <div>
            <span className="sm-badge">Admin Panel</span>
            <h1>Send Message</h1>
            <p>Send announcements, replies, or direct messages to users.</p>
          </div>

          <Link to="/" className="sm-back-btn">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="sm-card">
          <div className="sm-card-top">
            <div>
              <h2>Compose Message</h2>
              <span>Quick and clean message form</span>
            </div>
            <div className="sm-status-pill">Ready</div>
          </div>

          <form onSubmit={handleSubmit} className="sm-form">
            <div className="sm-grid">
              <div className="sm-field sm-field-full">
                <label htmlFor="sm-email">Email</label>
                <input
                  id="sm-email"
                  type="email"
                  name="email"
                  placeholder="Enter user email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm-field sm-field-full">
                <label htmlFor="sm-subject">Subject</label>
                <input
                  id="sm-subject"
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm-field sm-field-full">
                <label htmlFor="sm-message">Message</label>
                <textarea
                  id="sm-message"
                  name="message"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="sm-actions">
              <button
                type="button"
                className="sm-btn sm-btn-secondary"
                onClick={() =>
                  setFormData({ email: '', subject: '', message: '' })
                }
              >
                Clear
              </button>

              <button type="submit" className="sm-btn sm-btn-primary">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendMessage;
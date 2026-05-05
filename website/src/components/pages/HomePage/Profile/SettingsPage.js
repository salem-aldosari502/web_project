import React, { useState, useEffect } from "react";
import { ToggleButton, ButtonGroup } from "react-bootstrap";
import AboutUs from '../About';
import ContactUs from '../Contact';

function SettingsPage() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('notificationsEnabled');
        if (saved === 'true') {
            setNotificationsEnabled(true);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
    }, [notificationsEnabled]);

    const toggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
  <section className="settings-card">
    <div className="settings-container">

      <h1>Settings</h1>

      <section className="settings-section">
        <h3>Notifications</h3>

        <div className="settings-row">
          <span className="settings-label">Email Notifications</span>

          <div className="settings-value toggle-container">
            <ToggleButton
              id="notification-toggle"
              type="checkbox"
              variant={notificationsEnabled ? "success" : "outline-secondary"}
              checked={notificationsEnabled}
              onChange={toggleNotifications}
            >
              {notificationsEnabled ? "ON" : "OFF"}
            </ToggleButton>
          </div>
        </div>

        <p className="settings-description">
          Turn it on to receive content about new features (every two weeks)
        </p>
      </section>

      <section className="settings-section">
        <h3>About Us</h3>
        <div className="embedded-content">
          <AboutUs />
        </div>
      </section>

      <section className="settings-section">
        <h3>Contact Us</h3>
        <div className="embedded-content">
          <ContactUs />
        </div>
      </section>

    </div>
  </section>
);
}

export default SettingsPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

function Admin() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarClosed, setSidebarClosed] = useState(false);

  return (
    <div className={`admin-page ${darkMode ? 'dark' : ''}`}>
      <nav className={`admin-nav ${sidebarClosed ? 'close' : ''}`}>
        <div className="admin-logo-name">
          <span className="admin-logo-text">CodingLab</span>
        </div>

        <div className="admin-menu-items">
          <ul className="admin-nav-links">

            <li>
              <Link to="/delete">
                <i className="uil uil-trash"></i>
                <span className="admin-link-name">Delete Account</span>
              </Link>
            </li>

            <li>
              <Link to="/edituser">
                <i className="uil uil-user-square"></i>
                <span className="admin-link-name">Edit User</span>
              </Link>
            </li>

           <li>
               <Link to="/sendmessage">
                <i className="uil uil-message"></i>
                <span className="admin-link-name">Send Message</span>
              </Link>
          </li>

            <li>
              <Link to="/userdata">
             <i className="uil uil-users-alt"></i>
              <span className="admin-link-name">Users Data</span>
              </Link>
          </li>


          </ul>

          <ul className="admin-logout-mode">
            <li>
              <a href="/">
                <i className="uil uil-signout"></i>
                <span className="admin-link-name">Logout</span>
              </a>
            </li>

            <li className="admin-mode">
              <button
                type="button"
                className="admin-mode-btn"
                onClick={() => setDarkMode(!darkMode)}
              >
                <i className={`uil ${darkMode ? 'uil-sun' : 'uil-moon'}`}></i>
                <span className="admin-link-name">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>

              <div
                className="admin-mode-toggle"
                onClick={() => setDarkMode(!darkMode)}
              >
                <span className="admin-switch"></span>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <section className="admin-dashboard">
        <div className="admin-top">
          <i
            className="uil uil-bars"
            style={{ fontSize: '26px', cursor: 'pointer' }}
            onClick={() => setSidebarClosed(!sidebarClosed)}
          ></i>

          <div className="admin-search-box">
            <i className="uil uil-search"></i>
            <input type="text" placeholder="Search here..." />
          </div>
        </div>

        <div className="admin-dash-content">
          <div className="admin-title">
            <i className="uil uil-tachometer-fast-alt"></i>
            <span className="admin-text">Dashboard</span>
          </div>

          <div className="boxes">
            <div className="box box1">
              <i className="uil uil-thumbs-up"></i>
              <span className="text">Total Likes</span>
              <span className="number">50,120</span>
            </div>

            <div className="box box2">
              <i className="uil uil-comments"></i>
              <span className="text">Comments</span>
              <span className="number">20,120</span>
            </div>

            <div className="box box3">
              <i className="uil uil-share"></i>
              <span className="text">Total Share</span>
              <span className="number">10,120</span>
            </div>
          </div>

          <div className="activity">
            <div className="admin-title">
              <i className="uil uil-clock-three"></i>
              <span className="admin-text">Recent Activity</span>
            </div>

            <div className="activity-data">
              <div className="data names">
                <span className="data-title">Name</span>
                <span className="data-list">Prem Shahi</span>
                <span className="data-list">Deepa Chand</span>
                <span className="data-list">Manisha Chand</span>
                <span className="data-list">Pratima Shahi</span>
                <span className="data-list">Man Shahi</span>
                <span className="data-list">Ganesh Chand</span>
                <span className="data-list">Bikash Chand</span>
              </div>

              <div className="data email">
                <span className="data-title">Email</span>
                <span className="data-list">prem@gmail.com</span>
                <span className="data-list">deepa@gmail.com</span>
                <span className="data-list">manisha@gmail.com</span>
                <span className="data-list">pratima@gmail.com</span>
                <span className="data-list">man@gmail.com</span>
                <span className="data-list">ganesh@gmail.com</span>
                <span className="data-list">bikash@gmail.com</span>
              </div>

              <div className="data joined">
                <span className="data-title">Joined</span>
                <span className="data-list">2022-02-12</span>
                <span className="data-list">2022-02-12</span>
                <span className="data-list">2022-02-13</span>
                <span className="data-list">2022-02-13</span>
                <span className="data-list">2022-02-14</span>
                <span className="data-list">2022-02-14</span>
                <span className="data-list">2022-02-15</span>
              </div>

              <div className="data type">
                <span className="data-title">Type</span>
                <span className="data-list">New</span>
                <span className="data-list">Member</span>
                <span className="data-list">Member</span>
                <span className="data-list">New</span>
                <span className="data-list">Member</span>
                <span className="data-list">New</span>
                <span className="data-list">Member</span>
              </div>

              <div className="data status">
                <span className="data-title">Status</span>
                <span className="data-list">Liked</span>
                <span className="data-list">Liked</span>
                <span className="data-list">Liked</span>
                <span className="data-list">Liked</span>
                <span className="data-list">Liked</span>
                <span className="data-list">Liked</span>
                <span className="data-list">Liked</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Admin;
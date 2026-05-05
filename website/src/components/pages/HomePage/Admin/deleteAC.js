import { Link } from 'react-router-dom';
import './deleteac.css';

function DeleteAc() {
  return (
    <div className="ud-page">
      <div className="ud-shell">
        <div className="ud-header">
          <div>
            <span className="ud-badge">Admin Panel</span>
            <h1>Delete Account</h1>
            <p>Remove user accounts permanently from the system.</p>
          </div>
          <Link to="/admin" className="ud-back-btn">← Back to Dashboard</Link>
        </div>

        <div className="ud-card">
          <div className="ud-card-top">
            <div>
              <h2>Account Deletion</h2>
              <span>Permanent action - cannot be undone</span>
            </div>
          </div>

          <form>
            <div className="sm-grid">
              <div className="sm-field">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your name" />
              </div>

              <div className="sm-field">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" />
              </div>

              <div className="sm-field sm-field-full">
                <label>Reason for Deletion</label>
                <textarea placeholder="Why do you want to delete this account?"></textarea>
              </div>
            </div>

            <div className="sm-actions">
              <Link to="/admin" className="sm-btn sm-btn-secondary">Cancel</Link>
              <button type="button" className="sm-btn sm-btn-primary">Delete Now</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default DeleteAc;
import { Link } from 'react-router-dom';
import './deleteac.css';

function DeleteAc() {
  return (
    <div className="delete-page">
      <div className="delete-container">
        <Link to="/" className="back-btn">← Back to Dashboard</Link>

        <div className="delete-content">
          <div className="delete-left-side">
            <div className="delete-details">
              <i className="fas fa-map-marker-alt"></i>
              <div className="delete-topic">Address</div>
              <div className="delete-text-one">Surkhet, NP12</div>
              <div className="delete-text-two">Birendranagar 06</div>
            </div>

            <div className="delete-details">
              <i className="fas fa-phone-alt"></i>
              <div className="delete-topic">Phone</div>
              <div className="delete-text-one">+0098 9893 5647</div>
              <div className="delete-text-two">+0096 3434 5678</div>
            </div>

            <div className="delete-details">
              <i className="fas fa-envelope"></i>
              <div className="delete-topic">Email</div>
              <div className="delete-text-one">codinglab@gmail.com</div>
              <div className="delete-text-two">info.codinglab@gmail.com</div>
            </div>
          </div>

          <div className="delete-right-side">
            <div className="delete-topic-text">Delete Account Page</div>
            <p>This is a separate page from the dashboard.</p>

            <form>
              <div className="delete-input-box">
                <input type="text" placeholder="Enter your name" />
              </div>

              <div className="delete-input-box">
                <input type="text" placeholder="Enter your email" />
              </div>

              <div className="delete-input-box delete-message-box">
                <textarea placeholder="Why do you want to delete account?"></textarea>
              </div>

              <div className="delete-button">
                <input type="button" value="Delete Now" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteAc;
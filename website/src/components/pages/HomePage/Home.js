import './home.css';
import hotels_image from "../../../images/hotels_image.png";
import restaurants_image from "../../../images/restaurants_image.png";
import events_image from "../../../images/events_image.png";
import AboutUs from './About';
import ContactUs from './Contact';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';


function Home() {
  return (
    <div className="page-wrapper">
      <div className="background-layer"></div>

      <div className='horizental_line'>
            <HeroSection />
            <section className="cards-section">
            <div className="section-header">
                <h2>Explore Categories</h2>
                <p>Choose what you want to discover.</p>
            </div>

            <div className="places-grid">
                <Link to="/hotels">
                    <figure className="effect-ruby">
                    <img src={hotels_image} alt="Hotels" />
                    <figcaption>
                        <h5>Hotels</h5>
                        <p>577 Listings</p>
                    </figcaption>
                    </figure>
                </Link>

                <Link to="/restaurants">
                    <figure className="effect-ruby">
                    <img src={restaurants_image} alt="Restaurants" />
                    <figcaption>
                        <h5>Restaurants</h5>
                        <p>210 Listings</p>
                    </figcaption>
                    </figure>
                </Link>

                <Link to="/events">
                    <figure className="effect-ruby">
                    <img src={events_image} alt="Events" />
                    <figcaption>
                        <h5>Events</h5>
                        <p>95 Listings</p>
                    </figcaption>
                    </figure>
                </Link>
            </div>
            </section>

            <ContactUs />
            <hr />
            <AboutUs />
        </div>
    </div>
  );
}


export default Home;
import "./App.css";
import { useState } from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./components/pages/HomePage/Home";
import NotFound from "./components/pages/HomePage/Notfound";
import Navigation from "./components/NavBar";
import Footer from "./components/footer";
import AboutUs from './components/pages/HomePage/About';
import ContactUs from './components/pages/HomePage/Contact';
import Login from "./components/pages/HomePage/login";
import SignUp from "./components/pages/HomePage/Signup";
import HotelsPage from "./components/pages/HomePage/Category/HotelsPage/HotelList/hotelPage";
import RestaurantsPage from "./components/pages/HomePage/Category/RestaurantPage/RestaurantList/restaurantsPage";
import EventPage from "./components/pages/HomePage/Category/EventsPage/EventList/eventsPage";
import AskAIChat from "./components/pages/HomePage/AI_frame";
import ProfilePage from "./components/pages/HomePage/profilePage";

function App() {
  const [showAI, setShowAI] = useState(false);
  const [user, setUser] = useState(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  return (<>
    <div className="background-layer"></div>
    <div className="overlay-layer"></div>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <div className="title">
      <h1>Trip Management For Kuwait</h1>
    </div>
    <Navigation setShowAI={setShowAI} user={user} setUser={setUser} />
    <header className="App-header">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </header>
    <AskAIChat showAI={showAI} setShowAI={setShowAI}/>
    <Footer />
  </>);
}

export default App;


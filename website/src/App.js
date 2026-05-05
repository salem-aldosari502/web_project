import "./App.css";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/pages/HomePage/Home";
import NotFound from "./components/pages/HomePage/Notfound";
import Navigation from "./components/NavBar";
import Footer from "./components/footer";
import AboutUs from './components/pages/HomePage/About';
import ContactUs from './components/pages/HomePage/Contact';
import Login from "./components/pages/HomePage/Signup_AND_Login/login";
import SignUp from "./components/pages/HomePage/Signup_AND_Login/Signup";
import HotelsPage from "./components/pages/HomePage/Category/HotelsPage/HotelList/hotelPage";
import RestaurantsPage from "./components/pages/HomePage/Category/RestaurantPage/RestaurantList/restaurantsPage";
import EventPage from "./components/pages/HomePage/Category/EventsPage/EventList/eventsPage";
import AskAIChat from "./components/pages/HomePage/AI/AI_frame";
import ProfilePage from "./components/pages/HomePage/Profile/profilePage";
import ServerStatus from "./components/ServerStatus";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SettingsPage from "./components/pages/HomePage/Profile/SettingsPage";
import ScrollToTop from "./components/pages/HomePage/ScrollToTop";
import ReviewPage from "./components/pages/HomePage/ReviewPage";
import Admin from "./components/pages/HomePage/Admin/admin";
import DeleteAc from './components/pages/HomePage/Admin/deleteAC';
import EditUser from './components/pages/HomePage/Admin/edituser';
import SendMessage from './components/pages/HomePage/Admin/sendmessage';
import UserData from './components/pages/HomePage/Admin/userdata';
import ForgetPassword from "./components/pages/HomePage/Password_Operations/ForgetPassword";
import ResetPassword from "./components/pages/HomePage/Password_Operations/ResetPassword";
import MainPage from "./components/pages/mainPage";


function AdminRoute({ children }) {
    const { auth } = useAuth();

    const storedUser = (() => {
        try {
            const s = localStorage.getItem('user') || localStorage.getItem('auth_user');
            return s ? JSON.parse(s) : null;
        } catch { return null; }
    })();

    const id = auth?.id || storedUser?.id;
    const role = auth?.role || storedUser?.role;

    if (!id) return <Navigate to="/login" replace />;
    if (role !== 'admin') return <Navigate to="/home" replace />;
    return children;
}

function App() {
    const [showAI, setShowAI] = useState(false);
    const [user, setUser] = useState(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            try {
                const stored = localStorage.getItem('auth_user');
                return stored ? JSON.parse(stored) : null;
            } catch {
                return null;
            }
        }
        return null;
    });

    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    return (
        <ServerStatus>
            <AuthProvider>
                <div className="background-layer"></div>
                <div className="overlay-layer"></div>
                <div className="title">
                    <h1>Trip Management For Kuwait</h1>
                </div>
                <Navigation setShowAI={setShowAI} user={user} setUser={setUser} />
                <header className="App-header">
                    <ScrollToTop />
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/aboutus" element={<AboutUs />} />
                        <Route path="/contactus" element={<ContactUs />} />
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/forgot-password" element={<ForgetPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/hotels" element={<HotelsPage />} />
                        <Route path="/restaurants" element={<RestaurantsPage />} />
                        <Route path="/events" element={<EventPage />} />
                        <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/reviewpage" element={<ReviewPage />} />
                        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                        <Route path="/delete" element={<AdminRoute><DeleteAc /></AdminRoute>} />
                        <Route path="/edituser" element={<AdminRoute><EditUser /></AdminRoute>} />
                        <Route path="/sendmessage" element={<AdminRoute><SendMessage /></AdminRoute>} />
                        <Route path="/userdata" element={<AdminRoute><UserData /></AdminRoute>} />
                        <Route path="/" element={<MainPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </header>
                <AskAIChat showAI={showAI} setShowAI={setShowAI} />
                <Footer />
            </AuthProvider>
        </ServerStatus>
    );
}

export default App;
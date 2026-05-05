import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Default_Avatar from "../images/Default_Avatar.png";
import "./NavBar.css";

function Navigation({ setShowAI, user, setUser }) {
    const navigate = useNavigate();
    const { logout, auth } = useAuth();
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const storedUserStr = localStorage.getItem('user') || localStorage.getItem('auth_user');
        let avatarFromUser = null;
        if (storedUserStr) {
            try {
                const storedUser = JSON.parse(storedUserStr);
                avatarFromUser = storedUser.avatar && storedUser.avatar !== "null" ? storedUser.avatar : null;
            } catch (e) {}
        }
        const savedAvatar = localStorage.getItem(`profileAvatar_${user?.id}`);
        const cleanSavedAvatar = savedAvatar && savedAvatar !== "null" ? savedAvatar : null;
        setAvatarSrc(avatarFromUser || cleanSavedAvatar || null);
    }, [user, user?.id]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        setAvatarSrc(null);
        setDropdownOpen(false);
        setMenuOpen(false);
        navigate('/home');
    };

    const storedUser = (() => {
        try {
            const s = localStorage.getItem('user') || localStorage.getItem('auth_user');
            return s ? JSON.parse(s) : null;
        } catch { return null; }
    })();
    const isAdmin = auth?.role === 'admin' || storedUser?.role === 'admin';
    const avatarUrl = avatarSrc || Default_Avatar;

    return (
        <nav className={`lux-nav ${scrolled ? 'lux-nav--scrolled' : ''}`}>
            <div className="lux-nav__inner">

                {/* Left: AI button */}
                <div className="lux-nav__left">
                    <button className="lux-ai-btn" onClick={() => setShowAI(true)}>
                        <span className="lux-ai-btn__icon">✦</span>
                        <span>Ask AI</span>
                    </button>
                </div>

                {/* Center: brand */}
                <div className="lux-nav__brand">
                    <Link to="/home" className="lux-brand-link">
                        Trip<span className="lux-brand-accent">Kuwait</span>
                    </Link>
                </div>

                {/* Right: links + avatar/auth */}
                <div className={`lux-nav__right ${menuOpen ? 'lux-nav__right--open' : ''}`}>
                    <Link to="/home"     className="lux-nav__link" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/aboutus"  className="lux-nav__link" onClick={() => setMenuOpen(false)}>About</Link>
                    <Link to="/contactus" className="lux-nav__link" onClick={() => setMenuOpen(false)}>Contact</Link>

                    {user && isAdmin && (
                        <Link to="/admin" className="lux-nav__link lux-nav__link--admin" onClick={() => setMenuOpen(false)}>
                            Dashboard
                        </Link>
                    )}

                    {user ? (
                        <div className="lux-avatar-wrap" ref={dropdownRef}>
                            <button
                                className="lux-avatar-btn"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-label="Account menu"
                            >
                                <img
                                    src={avatarUrl}
                                    alt="avatar"
                                    className="lux-avatar-img"
                                    onError={(e) => { e.target.src = Default_Avatar; }}
                                />
                                <span className="lux-avatar-caret">{dropdownOpen ? '▴' : '▾'}</span>
                            </button>

                            {dropdownOpen && (
                                <div className="lux-dropdown">
                                    <Link to="/profile"  className="lux-dropdown__item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                                    <Link to="/settings" className="lux-dropdown__item" onClick={() => setDropdownOpen(false)}>Settings</Link>
                                    {isAdmin && (
                                        <Link to="/admin" className="lux-dropdown__item lux-dropdown__item--admin" onClick={() => setDropdownOpen(false)}>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <div className="lux-dropdown__divider" />
                                    <button className="lux-dropdown__item lux-dropdown__item--logout" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="lux-auth-btns">
                            <Link to="/login"  className="lux-btn-ghost-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
                            <Link to="/signup" className="lux-btn-gold-sm"  onClick={() => setMenuOpen(false)}>Join Free</Link>
                        </div>
                    )}
                </div>

                {/* Hamburger (mobile) */}
                <button
                    className={`lux-hamburger ${menuOpen ? 'lux-hamburger--open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </div>
        </nav>
    );
}

export default Navigation;
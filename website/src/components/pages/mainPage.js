import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import "./mainPage.css";

const reviews = [
  { id: 1, name: "Sarah Al-Rashidi", role: "Travel Enthusiast", rating: 5, text: "This platform completely transformed how I explore Kuwait. Finding hotels and restaurants has never been this seamless!", avatar: "S" },
  { id: 2, name: "Mohammed Al-Kuwari", role: "Business Traveler", rating: 5, text: "Incredibly well-organized. I booked three events in one evening. The interface is intuitive and beautifully designed.", avatar: "M" },
  { id: 3, name: "Layla Hassan", role: "Local Explorer", rating: 4, text: "I discovered hidden gems in my own city thanks to this platform. The reviews are genuine and the search filters are spot on.", avatar: "L" },
  { id: 4, name: "Ahmed Al-Sabah", role: "Food Blogger", rating: 5, text: "The restaurant section is a dream. Detailed info, honest ratings, and a gorgeous layout. Highly recommended!", avatar: "A" },
  { id: 5, name: "Nora Al-Mutairi", role: "Event Planner", rating: 5, text: "Planning events in Kuwait used to be stressful. Now it's a pleasure. This site is a game changer for the local scene.", avatar: "N" },
  { id: 6, name: "Khalid Mansoor", role: "Tourist", rating: 4, text: "Visited Kuwait for the first time and this app was my guide. Everything I needed was right here, organized perfectly.", avatar: "K" },
];

const stats = [
  { value: "500+", label: "Hotels Listed" },
  { value: "1,200+", label: "Restaurants" },
  { value: "300+", label: "Events Monthly" },
  { value: "50K+", label: "Happy Users" },
];

const features = [
  {
    icon: "🏨",
    title: "Curated Hotels",
    desc: "Handpicked accommodations from budget-friendly stays to five-star luxury — all verified and reviewed.",
  },
  {
    icon: "🍽️",
    title: "Top Restaurants",
    desc: "Discover Kuwait's finest dining experiences, from traditional cuisine to international flavors.",
  },
  {
    icon: "🎭",
    title: "Live Events",
    desc: "Never miss what's happening. Browse concerts, exhibitions, cultural shows, and more.",
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    desc: "Our smart AI helps you plan your perfect trip with personalized recommendations.",
  },
];

export default function MainPage() {
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [visibleStats, setVisibleStats] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const sliderRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleStats(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollSlider = (dir) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="mp-root">
      {/* ── NAV ── */}
      <nav className="mp-nav">
        <div className="mp-nav-logo">
          <span className="mp-logo-icon">✦</span>
          <span>TripKuwait</span>
        </div>
        <div className="mp-nav-links">
          <button onClick={() => navigate("/login")} className="mp-nav-login">Sign In</button>
          <button onClick={() => navigate("/signup")} className="mp-nav-join">Join Free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="mp-hero">
        <div className="mp-hero-bg">
          <div className="mp-orb mp-orb1" />
          <div className="mp-orb mp-orb2" />
          <div className="mp-orb mp-orb3" />
          <div className="mp-grid-overlay" />
        </div>
        <div className="mp-hero-content">
          <div className="mp-hero-badge">🇰🇼 Kuwait's #1 Travel Platform</div>
          <h1 className="mp-hero-title">
            Discover the Soul<br />
            <span className="mp-hero-accent">of Kuwait</span>
          </h1>
          <p className="mp-hero-sub">
            Hotels, restaurants, and events — all in one beautifully crafted experience.
            Your journey starts here.
          </p>
          <div className="mp-hero-cta">
            <button className="mp-btn-primary" onClick={() => navigate("/signup")}>
              Join Us <span className="mp-btn-arrow">→</span>
            </button>
            <button className="mp-btn-ghost" onClick={() => navigate("/login")}>
              I have an account
            </button>
          </div>
          <div className="mp-hero-scroll">
            <span>Scroll to explore</span>
            <div className="mp-scroll-line" />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="mp-stats" ref={statsRef}>
        {stats.map((s, i) => (
          <div key={i} className={`mp-stat ${visibleStats ? "mp-stat-visible" : ""}`} style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="mp-stat-value">{s.value}</div>
            <div className="mp-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="mp-features">
        <div className="mp-section-header">
          <div className="mp-section-tag">What We Offer</div>
          <h2 className="mp-section-title">Everything Kuwait,<br />All in One Place</h2>
        </div>
        <div className="mp-features-grid">
          {features.map((f, i) => (
            <div key={i} className="mp-feature-card">
              <div className="mp-feature-icon">{f.icon}</div>
              <h3 className="mp-feature-title">{f.title}</h3>
              <p className="mp-feature-desc">{f.desc}</p>
              <div className="mp-feature-line" />
            </div>
          ))}
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="mp-reviews">
        <div className="mp-section-header">
          <div className="mp-section-tag">Community</div>
          <h2 className="mp-section-title">What People Are Saying</h2>
        </div>

        {/* Slider */}
        <div className="mp-slider-wrapper">
          <button className="mp-slider-btn mp-slider-prev" onClick={() => scrollSlider(-1)}>‹</button>
          <div className="mp-slider" ref={sliderRef}>
            {reviews.map((r) => (
              <div key={r.id} className="mp-review-card">
                <div className="mp-review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <p className="mp-review-text">"{r.text}"</p>
                <div className="mp-review-author">
                  <div className="mp-review-avatar">{r.avatar}</div>
                  <div>
                    <div className="mp-review-name">{r.name}</div>
                    <div className="mp-review-role">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mp-slider-btn mp-slider-next" onClick={() => scrollSlider(1)}>›</button>
        </div>

        {/* All Reviews Toggle */}
        <div className="mp-reviews-toggle-wrap">
          <button className="mp-toggle-btn" onClick={() => setShowAllReviews(!showAllReviews)}>
            {showAllReviews ? "Hide Reviews ▲" : "All Reviews ▼"}
          </button>
        </div>

        {showAllReviews && (
          <div className="mp-all-reviews">
            {reviews.map((r) => (
              <div key={r.id} className="mp-all-review-card">
                <div className="mp-review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <p className="mp-review-text">"{r.text}"</p>
                <div className="mp-review-author">
                  <div className="mp-review-avatar">{r.avatar}</div>
                  <div>
                    <div className="mp-review-name">{r.name}</div>
                    <div className="mp-review-role">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mp-cta-banner">
        <div className="mp-cta-glow" />
        <h2 className="mp-cta-title">Ready to Explore Kuwait?</h2>
        <p className="mp-cta-sub">Join thousands of travelers who trust TripKuwait every day.</p>
        <button className="mp-btn-primary mp-cta-btn" onClick={() => navigate("/signup")}>
          Get Started Free <span className="mp-btn-arrow">→</span>
        </button>
      </section>

      <Footer />
    </div>
  );
}
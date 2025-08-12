import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import bottleLeft from "./assets/bottle-left.png";
import bottleRight from "./assets/bottle-right.png";
import "./App.css"; // Your CSS with styles for carousel, feature cards, etc.

const features = [
  { title: "Pacifier", desc: "Job hunting tantrums? Put a binky in it!" },
  { title: "Cradle", desc: "Where your projects nap soundly until they’re ready to roll!" },
  { title: "Stroller", desc: "Cruise your career path with zero bumps!" },
  { title: "Burp", desc: "Clean up your profile so you can wow recruiters!" },
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevFeature = () => {
    setActiveIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const nextFeature = () => {
    setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  // Calculate previous and next indexes for side cards
  const prevIndex = activeIndex === 0 ? features.length - 1 : activeIndex - 1;
  const nextIndex = activeIndex === features.length - 1 ? 0 : activeIndex + 1;

  return (
    <>
      <Navbar />
      <Hero />
   

      <section className="features-section">
        <h2 className="features-title ios-heading">Our Features</h2>
        <p className="features-subtext ios-subtext">
          Discover the cool stuff we bring to the table!
        </p>

        <div className="carousel">
          {/* Left Arrow */}
          <button className="carousel-btn" onClick={prevFeature}>
            <img src={bottleLeft} alt="Previous" />
          </button>

          <div className="carousel-track">
            {/* Previous feature - faded side slab */}
            <div className="feature-card side-card">
              <h3 className="pixel-compatible-font">{features[prevIndex].title}</h3>
              <p className="pixel-compatible-font">{features[prevIndex].desc}</p>
            </div>

            {/* Active feature - full size */}
            <div className="feature-card active">
              <h3 className="pixel-compatible-font">{features[activeIndex].title}</h3>
              <p className="pixel-compatible-font">{features[activeIndex].desc}</p>
            </div>

            {/* Next feature - faded side slab */}
            <div className="feature-card side-card">
              <h3 className="pixel-compatible-font">{features[nextIndex].title}</h3>
              <p className="pixel-compatible-font">{features[nextIndex].desc}</p>
            </div>
          </div>

          {/* Right Arrow */}
          <button className="carousel-btn" onClick={nextFeature}>
            <img src={bottleRight} alt="Next" />
          </button>
        </div>

        <button className="explore-btn">Explore</button>
      </section>
      <section className="about-section">
  <h2 className="about-title pixel-font">Who's behind the crib?</h2>
  <p className="about-subtext">
    Find out our little geniuses rocking the cradle of your job search and career journey
  </p>
  <button className="about-btn pixel-font">About Us</button>
</section>
<footer className="footer">
  <div className="footer-content">
    <p className="footer-text">© 2025 BabyCollab. All rights reserved.</p>
    <div className="social-icons">
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        🐦
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        🔗
      </a>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        🐙
      </a>
    </div>
  </div>
</footer>


    </>
  );
}

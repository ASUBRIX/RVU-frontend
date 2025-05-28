import React, { useEffect, useState } from "react";
import TinySlider from "@/components/TinySlider"; // Make sure TinySlider is correctly set up
import {fetchHeroSlides} from "@/helpers/homeApi"; // Import your API handler

// Optional: Simple loading spinner or skeleton
const Loading = () => (
  <div className="text-center py-5">
    <span>Loading banners...</span>
  </div>
);

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch slides from backend on mount
  useEffect(() => {
    (async () => {
      try {
        // Use your API utility
        const data = await fetchHeroSlides();
        
        
        setSlides(data);
      } catch (err) {
        console.error("Failed to fetch slides", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Slider settings (customize as needed)
  const sliderSettings = {
    items: 1,
    nav: false,
    controls: true,
    autoplay: true,
    autoplayTimeout: 5000,
    loop: true,
    mouseDrag: true,
    gutter: 0,
    controlsText: ['<', '>'],
    responsive: {
      992: { items: 1 }
    }
  };

  if (loading) return <Loading />;
  if (!slides.length)
    return (
      <div className="text-center py-5">
        <span>No banners to display</span>
      </div>
    );

  return (
    <section className="hero-slider-section">
      <TinySlider settings={sliderSettings} className="hero-slider">
        {slides.map((slide, idx) => (
          <div key={slide.id || idx} className="hero-slide position-relative">
            <img
              src={
                slide.image_url.startsWith("http")
                  ? slide.image_url
                  : `https://server.pudhuyugamacademy.com${slide.image_url}`
              }
              alt={slide.title}
              className="w-100"
              style={{
                maxHeight: 440,
                objectFit: "cover",
                borderRadius: "1rem"
              }}
            />
            <div className="slide-caption position-absolute top-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                 style={{
                   background: "rgba(0,0,0,0.35)",
                   color: "#fff",
                   left: 0
                 }}
            >
              <h2 className="display-5 fw-bold">{slide.title}</h2>
              {slide.description && (
                <p className="fs-5 text-light">{slide.description}</p>
              )}
              {slide.link && (
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-warning mt-3"
                >
                  Learn More
                </a>
              )}
            </div>
          </div>
        ))}
      </TinySlider>
    </section>
  );
};

export default HeroSlider;

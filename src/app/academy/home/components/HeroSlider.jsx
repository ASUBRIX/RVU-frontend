import React, { useEffect, useState } from "react";
import TinySlider from "@/components/TinySlider";
import { fetchHeroSlides } from "@/helpers/homeApi";
import "./HeroSlider.css";

const Loading = () => (
  <div className="text-center py-5">
    <span>Loading banners...</span>
  </div>
);

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHeroSlides();
        setSlides(data || []);
      } catch (err) {
        console.error("Failed to fetch slides", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sliderSettings = {
    items: 1,
    nav: false,
    controls: true,
    autoplay: true,
    autoplayTimeout: 5000,
    loop: true,
    mouseDrag: true,
    gutter: 0,
    controlsText: ["<", ">"],
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
    <section className="hero-slider-section mb-0 pb-0 pt-0 mt-0">
      <TinySlider settings={sliderSettings} className="hero-slider">
        {slides.map((slide, idx) => {
          const imgUrl = slide.image_url.startsWith("http")
            ? slide.image_url
            : `${import.meta.env.VITE_API_BASE_URL}${slide.image_url}`;
          return (
            <div key={slide.id || idx} className="hero-slide-overlay">
              <img
                src={imgUrl}
                alt={slide.title}
                className="hero-image-overlay"
              />
              <div className="slide-caption-overlay">
                <h2 className="hero-title mb-3">{slide.title}</h2>
                {slide.description && (
                  <p className="hero-description mb-4">{slide.description}</p>
                )}
                {slide.link && (
                  <a
                    href={slide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-btn btn btn-warning btn-lg px-5 py-2"
                  >
                    Get Started
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </TinySlider>
    </section>
  );
};

export default HeroSlider;

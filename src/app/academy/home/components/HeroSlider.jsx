import React, { useEffect, useState } from 'react';
import TinySlider from '@/components/TinySlider'; // adjust path if needed
import { fetchHeroSlides } from '@/helpers/homeApi'; // adjust path as needed
import './HeroSlider.css';

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
        console.error('Failed to fetch slides', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sliderSettings = {
    items: 1,
    nav: false,
    controls: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayButton: false,
    autoplayButtonOutput: false,
    loop: true,
    mouseDrag: true,
    gutter: 0,
    responsive: {
      992: { items: 1 },
    },
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
          const imgUrl = slide.image_url.startsWith('http')
            ? slide.image_url
            : `${import.meta.env.VITE_API_BASE_URL}${slide.image_url}`;
          return (
            <div key={slide.id || idx} className="hero-slide-overlay">
              <img src={imgUrl} alt={slide.title} className="hero-image-overlay" />
              <div className="slide-caption-overlay">
                <h2 className="hero-title mb-3">{slide.title}</h2>
                {slide.description && <p className="hero-description mb-4">{slide.description}</p>}
                <button className="hero-btn btn btn-lg px-5 py-2" type="button">
                  Get Started
                </button>
              </div>
            </div>
          );
        })}
      </TinySlider>
    </section>
  );
};

export default HeroSlider;

import React, { useState, useEffect } from "react";
import "./styles.module.scss";

const ClubHomeHero = () => {
  const slides = [
    "/images/hero/court2.jpeg",
    "/images/hero/court3.jpeg",
    "/images/hero/court4.jpeg",
    "/images/hero/court5.jpeg",
    "/images/hero/court6.jpeg",
    "/images/hero/court8.jpeg",
    "/images/hero/court9.jpeg",
    "/images/hero/court10.jpeg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 60000);

    return () => {
      clearInterval(slideInterval);
    };
  }, []);

  return (
    <div className="carousel-container">
      <img
        className="hero"
        src={slides[currentSlide]}
        alt={`Slide ${currentSlide}`}
      />
    </div>
  );
};

export default ClubHomeHero;

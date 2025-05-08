import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container } from "react-bootstrap";

const CourseSlider = () => {
  const settings = {
    infinite: true,
    lazyLoad: "ondemand",
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const resources = [
      "https://img-c.udemycdn.com/course/750x422/382300_f75b_3.jpg",
      "https://img-c.udemycdn.com/course/750x422/382300_f75b_3.jpg",
      "https://img-c.udemycdn.com/course/750x422/382300_f75b_3.jpg",
      "https://img-c.udemycdn.com/course/750x422/382300_f75b_3.jpg",
  ];

  return (
    <Container className="mt-5">
      <Slider {...settings}>
        {resources.map((src, index) => (
          <div key={index} className="p-2">
            <img src={src} alt={`Slide ${index}`} className="w-100 rounded" />
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default CourseSlider;

import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import './Home.css';

function Home() {
  // Array of slides with mixed content types
  const slides = [
    { type: 'image', src: '/images/slide1.jpg', caption: 'Welcome to Ganitha Saviya' },
    { type: 'text', content: 'About Sasnaka Sansada - We are a charitable social service organization initiated with the intention of building a just and equitable society with a high level of human morality. We deliver our projects with the core of enabling human beings with optimum intellectual, social and spiritual balance. You are welcome to join our hands of rebuilding a nation with belief and intellect.' },
    { type: 'image', src: '/images/slide2.jpg', caption: 'The Largest Youth-Led Moment in Sri Lanka' },
    { type: 'text', content: 'About Ganith Saviya - Ganitha Saviya” is a signature project that was brought to life by Sasnaka Sansada with the primary objective of popularizing mathematics among rural children and uplifting the grades in Mathematics at the National G.C.E. (Ordinary Level) Examination. This project is conducted in all three languages by volunteering undergraduates from universities and other higher educational institutes affiliated with the Sasnaka Sansada Foundation.' },
    { type: 'image', src: '/images/slide3.jpg', caption: 'Inspiring Thousands of Students' },
    { type: 'text', content: 'Project Overview - The CSR arm of Commercial Bank of Ceylon PLC, together with a number of organizations, provides the necessary resources to support this initiative. During the last few years since 2013, the Ganitha Saviya team has carried out more than 800+ seminars and workshops in schools in various parts of the country. In the year 23/24, we conducted 1300+ seminars around the country targeting more than 75,000 students.' },
    { type: 'image', src: '/images/slide4.jpg', caption: 'Practical Methods - Real Impact' },
    { type: 'text', content: 'Our Latest Statistics - Scroll down to the statistics dashboard or visit our Legacy Dashboard' },
  ];

  // State to manage the active slide index
  const [index, setIndex] = useState(0);

  // Handler for manual slide selection
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <section id="home" className="home-section">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        className="slideshow-container"
        interval={4000} // Autoplay every 4 seconds
      >
        {slides.map((slide, idx) => (
          <Carousel.Item key={idx}>
            {slide.type === 'image' ? (
              <>
                <img
                  className="d-block w-100 slide-image"
                  src={slide.src}
                  alt={slide.caption}
                />
                <Carousel.Caption>
                  <h3>{slide.caption}</h3>
                </Carousel.Caption>
              </>
            ) : (
              <div className="slide-text">
                <h2>{slide.content}</h2>
              </div>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="scroll-down">
          <a href="#map" className="btn-scroll">
            Go To Statistics
          </a>
        </div>
    </section>
  );
}

export default Home;
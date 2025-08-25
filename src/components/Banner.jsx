import React, { useState, useEffect } from 'react';
import '../styles/Banner.css'; // CSS 파일 임포트

const BANNER_IMAGES = [
  '/images/banner_1.png',
  '/images/banner_3.png',
  '/images/banner_2.png'
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const TOTAL_SLIDES = BANNER_IMAGES.length;

  useEffect(() => {
    // 3초마다 다음 이미지 인덱스로 변경하는 로직은 그대로 둡니다.
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % TOTAL_SLIDES);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [TOTAL_SLIDES]);

  // ▼▼▼ 이 부분이 수정됩니다 ▼▼▼
  return (
    <div className="slider-container">
      {BANNER_IMAGES.map((imgSrc, index) => (
        <img
          key={index}
          src={imgSrc}
          alt={`Banner ${index + 1}`}
          // 현재 인덱스와 일치하는 이미지에만 'active' 클래스를 추가합니다.
          className={`slider-img ${index === currentIndex ? 'active' : ''}`}
        />
      ))}
    </div>
  );
};

export default Banner;
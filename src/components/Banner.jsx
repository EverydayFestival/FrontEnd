import React, { useState, useEffect, useRef } from 'react';
import '../styles/Banner.css'; // 제공해주신 CSS 파일을 임포트합니다.

// 배너에 표시할 이미지들의 주소를 배열로 관리합니다.
// 가지고 계신 이미지 경로로 수정해서 사용하세요.
const BANNER_IMAGES = [
  '/images/banner_1.png',
  '/images/banner_3.png',
  '/images/banner_2.png'
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const TOTAL_SLIDES = BANNER_IMAGES.length;

  useEffect(() => {
    // 3초마다 다음 슬라이드로 이동하는 인터벌 설정
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % TOTAL_SLIDES);
    }, 3000);

    // 컴포넌트가 언마운트될 때 인터벌을 정리(clean-up)합니다.
    return () => clearInterval(intervalId);
  }, [TOTAL_SLIDES]);

  // 슬라이드를 감싸는 컨테이너에 적용할 인라인 스타일
  const sliderStyle = {
    display: 'flex', // CSS에 이미 있지만, 명확성을 위해 추가
    width: `${TOTAL_SLIDES * 100}%`, // 모든 이미지를 한 줄에 담기 위한 전체 너비
    transform: `translateX(-${currentIndex * (100 / TOTAL_SLIDES)}%)`, // 현재 인덱스에 따라 슬라이더를 왼쪽으로 이동
    transition: 'transform 0.5s ease-in-out', // 부드러운 전환 효과
  };

  return (
    <div className="slider-container">
      <div style={sliderStyle} ref={sliderRef}>
        {BANNER_IMAGES.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            alt={`Banner ${index + 1}`}
            className="slider-img"
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
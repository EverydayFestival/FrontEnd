import React, { createContext, useState, useEffect } from "react";
import { initialFestivals } from "../data/festivals";

// 1. Context 생성
export const FestivalContext = createContext();

// 2. Provider 컴포넌트 생성
export function FestivalProvider({ children }) {
  // 축제 목록을 React의 state로 관리합니다.
  const [festivals, setFestivals] = useState([]);

  // 앱이 처음 시작될 때 localStorage에서 데이터를 불러옵니다.
  useEffect(() => {
    const savedFestivals = localStorage.getItem('my-festivals');
    if (savedFestivals) {
      setFestivals(JSON.parse(savedFestivals));
    } else {
      // 저장된 데이터가 없으면 초기 데이터를 사용합니다.
      setFestivals(initialFestivals);
    }
  }, []); // 빈 배열을 전달해 한 번만 실행되도록 합니다.

  // state가 변경될 때마다 localStorage에 자동으로 저장합니다.
  useEffect(() => {
    // festivals state가 비어있지 않을 때만 저장합니다. (초기 로딩 시 덮어쓰기 방지)
    if (festivals.length > 0) {
        localStorage.setItem('my-festivals', JSON.stringify(festivals));
    }
  }, [festivals]);

  // 새로운 축제를 추가하는 함수
  const addFestival = (newFestivalData) => {
    const newFestival = {
      id: festivals.length > 0 ? Math.max(...festivals.map(f => f.id)) + 1 : 1,
      success: true,
      code: 200,
      message: "축제 등록에 성공하였습니다.",
      data: newFestivalData,
    };
    
    // setFestivals를 통해 state를 업데이트하면, React가 알아서 화면을 새로고침합니다.
    setFestivals(prevFestivals => [...prevFestivals, newFestival]);
    return newFestival; // 방금 만든 축제 객체를 반환
  };

  // ID로 특정 축제를 찾는 함수
  const getFestivalById = (id) => {
    return festivals.find((f) => f.id === Number(id));
  };

  // Context를 통해 전달할 값들
  const value = { festivals, addFestival, getFestivalById };

  return (
    <FestivalContext.Provider value={value}>
      {children}
    </FestivalContext.Provider>
  );
}

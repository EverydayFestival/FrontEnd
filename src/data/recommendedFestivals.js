// src/data/festivalDetailData.js

// API 응답과 유사한 전체 데이터 객체
const recommendedFestivalsData = {
  success: true,
  code: "S200",
  message: "축제 목록을 성공적으로 불러왔습니다.",
  data: {
    festivalList: [
      {
        festivalId: "3",
        festivalName: "2025 봄꽃 축제",
        festivalOrganization: "서울시 문화재단",
        festivalHoldBegin: "2025-03-15T09:00:00",
        festivalHoldEnd: "2025-03-20T18:00:00",
        favored: "FAVORED",
        imageUrl: "/images/festival_spring.jpg"
      },
      {
        festivalId: "17",
        festivalName: "한강 여름 음악제",
        festivalOrganization: "한강문화진흥원",
        festivalHoldBegin: "2025-06-10T10:00:00",
        festivalHoldEnd: "2025-06-15T22:00:00",
        favored: "UNFAVORED",
        imageUrl: "/images/festival_summer.jpg"
      },
      {
        festivalId: "22",
        festivalName: "가을 단풍 축제",
        festivalOrganization: "국립공원공단",
        festivalHoldBegin: "2025-10-20T09:00:00",
        festivalHoldEnd: "2025-10-28T17:00:00",
        favored: "FAVORED",
        imageUrl: "/images/festival_autumn.jpg"
      }
    ]
  }
};

// 오류 해결: 'festivals'라는 이름으로 festivalList 배열을 named export 합니다.
export const festivals = recommendedFestivalsData.data.festivalList;
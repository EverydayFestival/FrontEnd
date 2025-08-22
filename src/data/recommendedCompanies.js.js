// src/data/recommendedCompanies.js

// FestivalDetail 페이지에서 추천 업체 목록으로 사용할 데이터입니다.

const recommendedCompaniesData = {
  success: true,
  code: "200",
  message: "추천 업체 목록 조회 성공",
  data: {
    companyList: [
      {
        id: 1,
        name: "영암과수원",
        category: "FOOD",
        favored: "FAVORED",
        city: "서울특별시",
        district: "마포구",
        detail: "월드컵로 15길 83 ..."
      },
      {
        id: 2,
        name: "농협과수원",
        category: "FOOD",
        favored: "FAVORED",
        city: "서울특별시",
        district: "서대문구",
        detail: "연세로 1길 2 ..."
      },
      {
        id: 3,
        name: "강남 수제버거",
        category: "FOOD",
        favored: "NOT_FAVORED",
        city: "서울특별시",
        district: "강남구",
        detail: "테헤란로 10길 25 ..."
      },
      {
        id: 4,
        name: "부산 해물탕",
        category: "FOOD",
        favored: "FAVORED",
        city: "부산광역시",
        district: "해운대구",
        detail: "해운대로 123 ..."
      },
      {
        id: 5,
        name: "대전 국밥집",
        category: "FOOD",
        favored: "NOT_FAVORED",
        city: "대전광역시",
        district: "중구",
        detail: "대종로 45 ..."
      },
      {
        id: 6,
        name: "전주 비빔밥",
        category: "FOOD",
        favored: "FAVORED",
        city: "전라북도",
        district: "완산구",
        detail: "전동 12길 8 ..."
      },
      {
        id: 7,
        name: "제주 흑돼지",
        category: "FOOD",
        favored: "FAVORED",
        city: "제주특별자치도",
        district: "제주시",
        detail: "동문로 22 ..."
      },
      {
        id: 8,
        name: "인천 중화요리",
        category: "FOOD",
        favored: "NOT_FAVORED",
        city: "인천광역시",
        district: "남동구",
        detail: "인주대로 78 ..."
      },
      {
        id: 9,
        name: "수원 갈비",
        category: "FOOD",
        favored: "FAVORED",
        city: "경기도",
        district: "권선구",
        detail: "덕영대로 90 ..."
      },
      {
        id: 10,
        name: "광주 송정떡갈비",
        category: "FOOD",
        favored: "NOT_FAVORED",
        city: "광주광역시",
        district: "북구",
        detail: "송정로 55 ..."
      }
    ]
  }
};

export const companies = recommendedCompaniesData.data.companyList;

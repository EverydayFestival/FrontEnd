// src/data/mainPageData.js

export const mainPageData = {
  success: true,
  code: "200",
  message: "메인 홈페이지 조회",
  data: {
    festivalList: [
      {
        festivalId: 1,
        favored: true,
        festivalName: "서울 빛초롱 축제",
        festivalOrganization: "서울관광재단",
        festivalHoldBegin: "2025-12-19T17:00:00"
      },
      {
        festivalId: 2,
        favored: false,
        festivalName: "부산 국제 영화제",
        festivalOrganization: "부산국제영화제 조직위원회",
        festivalHoldBegin: "2025-10-02T10:00:00"
      },
      {
        festivalId: 3,
        favored: true,
        festivalName: "진해 군항제",
        festivalOrganization: "창원시",
        festivalHoldBegin: "2026-03-27T09:00:00"
      },
      {
        festivalId: 4,
        favored: false,
        festivalName: "보령 머드 축제",
        festivalOrganization: "보령축제관광재단",
        festivalHoldBegin: "2025-07-18T10:00:00"
      },
      {
        festivalId: 5,
        favored: true,
        festivalName: "제주 불꽃 축제",
        festivalOrganization: "제주관광공사",
        festivalHoldBegin: "2025-08-15T20:00:00"
      },
      {
        festivalId: 6,
        favored: false,
        festivalName: "강릉 커피 축제",
        festivalOrganization: "강릉시",
        festivalHoldBegin: "2025-09-01T09:00:00"
      }
    ],

    companyList: [
      {
        companyId: 1,
        favored: true,
        companyName: "지오네 닭꼬치",
        companyCategory: "FOOD",
        companyCity: "서울특별시"
      },
      {
        companyId: 2,
        favored: false,
        companyName: "홍대 떡볶이 연구소",
        companyCategory: "FOOD",
        companyCity: "서울특별시"
      },
      {
        companyId: 3,
        favored: true,
        companyName: "강남 수제버거",
        companyCategory: "FOOD",
        companyCity: "서울특별시"
      },
      {
        companyId: 4,
        favored: false,
        companyName: "부산 해물탕",
        companyCategory: "FOOD",
        companyCity: "부산광역시"
      },
      {
        companyId: 5,
        favored: true,
        companyName: "대전 국밥집",
        companyCategory: "FOOD",
        companyCity: "대전광역시"
      },
      {
        companyId: 6,
        favored: false,
        companyName: "전주 비빔밥",
        companyCategory: "FOOD",
        companyCity: "전라북도"
      },
      {
        companyId: 7,
        favored: false,
        companyName: "제주 흑돼지",
        companyCategory: "FOOD",
        companyCity: "제주특별자치도"
      },
      {
        companyId: 8,
        favored: true,
        companyName: "인천 중화요리",
        companyCategory: "FOOD",
        companyCity: "인천광역시"
      },
      {
        companyId: 9,
        favored: true,
        companyName: "수원 갈비",
        companyCategory: "FOOD",
        companyCity: "경기도"
      },
      {
        companyId: 10,
        favored: false,
        companyName: "광주 송정떡갈비",
        companyCategory: "FOOD",
        companyCity: "광주광역시"
      }
    ]
  }
};

// 메인 페이지 데이터를 가져오는 함수
export const getMainPageData = () => mainPageData;

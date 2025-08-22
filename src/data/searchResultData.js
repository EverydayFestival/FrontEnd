// src/data/searchResultData.js

export const searchResultData = {
  success: true,
  code: 200,
  message: "축제 검색에 성공하였습니다.",
  data: {
    content: [
      {
        id: 1,
        name: "서울 빛초롱 축제",
        holderName: "서울관광재단",
        address: {
          city: "서울특별시",
          district: "종로구",
          detail: "광화문광장 일대"
        },
        period: {
          begin: "2025-12-19T17:00:00",
          end: "2026-01-05T22:00:00"
        },
        favorStatus: "FAVORED",
        imageUrl: "/images/festival_01.jpg"
      },
      {
        id: 3,
        name: "진해 군항제",
        holderName: "창원시",
        address: {
          city: "경상남도",
          district: "창원시 진해구",
          detail: "여좌천, 경화역 등 진해구 일대"
        },
        period: {
          begin: "2026-03-27T09:00:00",
          end: "2026-04-05T21:00:00"
        },
        favorStatus: "FAVORED",
        imageUrl: "/images/festival_03.jpg"
      },
      {
        id: 4,
        name: "보령 머드 축제",
        holderName: "보령축제관광재단",
        address: {
          city: "충청남도",
          district: "보령시",
          detail: "대천해수욕장 머드광장"
        },
        period: {
          begin: "2025-07-18T10:00:00",
          end: "2025-07-27T22:00:00"
        },
        favorStatus: "NOT_FAVORED",
        imageUrl: "/images/festival_04.jpg"
      },
      {
        id: 8,
        name: "대구 국화 축제",
        holderName: "대구시청",
        address: {
            "city": "대구광역시",
            "district": "달서구",
            "detail": "두류공원 일원"
        },
        period: {
            "begin": "2025-11-01T09:00:00",
            "end": "2025-11-10T18:00:00"
        },
        favorStatus: "NOT_FAVORED",
        imageUrl: null
      }
    ],
    page: 0,
    size: 4,
    totalElements: 4,
    totalPages: 1,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false
  }
};

// 업체(company) 검색 결과 예시 데이터
export const companySearchResultData = {
    success: true,
    code: 200,
    message: "업체 검색에 성공하였습니다.",
    data: {
        content: [
            {
                id: 1,
                name: "맛있는 푸드트럭",
                category: "FOOD",
                address: { city: "서울", district: "강남구" },
                favored: true,
                imageUrl: "/images/manager_01.jpg"
            },
            {
                id: 2,
                name: "안전 지킴이",
                category: "SECURITY",
                address: { city: "부산", district: "해운대구" },
                favored: false,
                imageUrl: "/images/manager_02.jpg"
            }
        ],
        page: 0,
        size: 2,
        totalElements: 2,
        totalPages: 1,
        // ... (나머지 페이지 정보)
    }
}

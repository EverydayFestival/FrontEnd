// src/data/festivals.js

export const initialFestivals = [
  // 1. 서울 빛초롱 축제
  {
    id: 1,
    success: true,
    code: 200,
    message: "축제 상세 조회에 성공하였습니다.",
    data: {
      festivalOnlyDto: {
        name: "서울 빛초롱 축제",
        fee: "무료",
        time: "17:00 ~ 22:00",
        introduction: "매년 겨울, 아름다운 등불이 청계천과 광화문광장을 밝히는 서울의 대표 겨울 축제입니다.",
        tel: "02-123-4567",
        link: "http://www.seoullantern.com",
        holderName: "서울관광재단",
        imageUrl: "/images/festival_01.jpg",
        periodDto: { begin: "2025-12-19T17:00:00", end: "2026-01-05T22:00:00" },
        addressDto: { city: "서울특별시", district: "종로구", detail: "광화문광장 일대" },
        favorStatus: "FAVORED",
        applyStatus: "NOT_APPLIED"
      },
      companyRecruitStatus: "RECRUITING",
      companyRecruitDto: {
        id: 101,
        periodDto: { begin: "2025-11-01T09:00:00", end: "2025-11-20T18:00:00" },
        notice: "전통 공예품 및 겨울 간식 업체 환영합니다.",
        preferred: "종로구 소재 소상공인 우대",
        categories: ["HANDICRAFT", "SNACK"]
      },
      laborRecruitStatus: "RECRUITING",
      laborRecruitDto: {
        id: 201,
        periodDto: { begin: "2025-11-10T09:00:00", end: "2025-11-30T18:00:00" },
        notice: "야간 근무 가능자만 지원 바랍니다.",
        job: "안전관리 및 관람객 안내",
        wage: "시급 13,000원",
        remark: "따뜻한 근무복 및 방한용품 지급"
      }
    }
  },
  // 2. 부산 국제 영화제
  {
    id: 2,
    success: true,
    code: 200,
    message: "축제 상세 조회에 성공하였습니다.",
    data: {
      festivalOnlyDto: {
        name: "부산 국제 영화제",
        fee: "상영작별 상이",
        time: "10:00 ~ 23:00",
        introduction: "아시아 최대의 영화 축제, 부산 국제 영화제에서 전 세계의 다양한 영화를 만나보세요.",
        tel: "051-709-2000",
        link: "https://www.biff.kr",
        holderName: "부산국제영화제 조직위원회",
        imageUrl: "/images/festival_02.jpg",
        periodDto: { begin: "2025-10-02T10:00:00", end: "2025-10-11T23:00:00" },
        addressDto: { city: "부산광역시", district: "해운대구", detail: "영화의전당, BIFF 광장 등" },
        favorStatus: "NOT_FAVORED",
        applyStatus: "NOT_APPLIED"
      },
      companyRecruitStatus: "NOT_RECRUITING",
      companyRecruitDto: null,
      laborRecruitStatus: "RECRUITMENT_COMPLETED",
      laborRecruitDto: null
    }
  },
  // 3. 진해 군항제
  {
    id: 3,
    success: true,
    code: 200,
    message: "축제 상세 조회에 성공하였습니다.",
    data: {
      festivalOnlyDto: {
        name: "진해 군항제",
        fee: "무료 (일부 유료)",
        time: "상시",
        introduction: "아름다운 벚꽃과 함께하는 대한민국 최대의 봄꽃 축제, 진해 군항제를 즐겨보세요.",
        tel: "055-225-2341",
        link: "http://www.jgfestival.or.kr",
        holderName: "창원시",
        imageUrl: "/images/festival_03.jpg",
        periodDto: { begin: "2026-03-27T09:00:00", end: "2026-04-05T21:00:00" },
        addressDto: { city: "경상남도", district: "창원시 진해구", detail: "여좌천, 경화역 등 진해구 일대" },
        favorStatus: "FAVORED",
        applyStatus: "APPLIED"
      },
      companyRecruitStatus: "RECRUITING",
      companyRecruitDto: {
        id: 103,
        periodDto: { begin: "2026-02-15T09:00:00", end: "2026-03-05T18:00:00" },
        notice: "벚꽃 관련 상품 판매 부스를 모집합니다.",
        preferred: "친환경 제품 판매 업체",
        categories: ["SOUVENIR", "FOOD"]
      },
      laborRecruitStatus: "RECRUITING",
      laborRecruitDto: {
        id: 203,
        periodDto: { begin: "2026-02-20T09:00:00", end: "2026-03-10T18:00:00" },
        notice: "주말 근무는 필수입니다. 성실한 분을 찾습니다.",
        job: "행사장 환경미화 및 주차 안내",
        wage: "일급 100,000원",
        remark: "점심 식사 및 간식 제공"
      }
    }
  },
  // 4. 보령 머드 축제
  {
    id: 4,
    success: true,
    code: 200,
    message: "축제 상세 조회에 성공하였습니다.",
    data: {
      festivalOnlyDto: {
        name: "보령 머드 축제",
        fee: "성인 14,000원",
        time: "10:00 ~ 18:00 (야간 개장 별도)",
        introduction: "전 세계인이 함께 즐기는 신나는 머드의 향연! 보령 머드 축제에서 잊지 못할 추억을 만드세요.",
        tel: "041-930-0891",
        link: "https://mudfestival.or.kr",
        holderName: "보령축제관광재단",
        imageUrl: "/images/festival_04.jpg",
        periodDto: { begin: "2025-07-18T10:00:00", end: "2025-07-27T22:00:00" },
        addressDto: { city: "충청남도", district: "보령시", detail: "대천해수욕장 머드광장" },
        favorStatus: "NOT_FAVORED",
        applyStatus: "NOT_APPLIED"
      },
      companyRecruitStatus: "RECRUITING",
      companyRecruitDto: {
        id: 104,
        periodDto: { begin: "2025-06-01T09:00:00", end: "2025-06-20T18:00:00" },
        notice: "음료 및 스낵 판매 업체를 모집합니다.",
        preferred: "보령시 관내 사업자",
        categories: ["DRINK", "SNACK"]
      },
      laborRecruitStatus: "RECRUITING",
      laborRecruitDto: {
        id: 204,
        periodDto: { begin: "2025-06-10T09:00:00", end: "2025-06-30T18:00:00" },
        notice: "활발하고 에너지 넘치는 분들의 지원을 기다립니다.",
        job: "머드 체험시설 운영 보조 및 안전 요원",
        wage: "시급 15,000원",
        remark: "유니폼 및 중식 제공, 샤워시설 이용 가능"
      }
    }
  },
  // 5~18 임의 축제 예시
  {
    id: 5,
    success: true,
    code: 200,
    message: "축제 상세 조회에 성공하였습니다.",
    data: {
      festivalOnlyDto: {
        name: "제주 불꽃 축제",
        fee: "무료",
        time: "20:00 ~ 23:00",
        introduction: "제주 바다 위로 펼쳐지는 화려한 불꽃쇼, 가족과 함께 즐겨보세요.",
        tel: "064-123-4567",
        link: "http://www.jejubfireworks.kr",
        holderName: "제주관광공사",
        imageUrl: "/images/festival_05.jpg",
        periodDto: { begin: "2025-08-15T20:00:00", end: "2025-08-15T23:00:00" },
        addressDto: { city: "제주특별자치도", district: "제주시", detail: "한림해변 일대" },
        favorStatus: "NOT_FAVORED",
        applyStatus: "NOT_APPLIED"
      },
      companyRecruitStatus: "NOT_RECRUITING",
      companyRecruitDto: null,
      laborRecruitStatus: "RECRUITING",
      laborRecruitDto: {
        id: 205,
        periodDto: { begin: "2025-07-01T09:00:00", end: "2025-07-10T18:00:00" },
        notice: "현장 안전 및 관람객 안내 요원 모집",
        job: "안전요원",
        wage: "시급 12,000원",
        remark: "간식 제공"
      }
    }
  },
  {
    id: 6,
    success: true,
    code: 200,
    message: "축제 상세 조회에 성공하였습니다.",
    data: {
      festivalOnlyDto: {
        name: "강릉 커피 축제",
        fee: "5,000원",
        time: "09:00 ~ 18:00",
        introduction: "커피의 향연을 즐기며 강릉의 아름다운 바다를 함께 경험하세요.",
        tel: "033-555-1234",
        link: "https://www.gangneungcoffee.kr",
        holderName: "강릉시",
        imageUrl: "/images/festival_06.jpg",
        periodDto: { begin: "2025-09-01T09:00:00", end: "2025-09-05T18:00:00" },
        addressDto: { city: "강원도", district: "강릉시", detail: "강릉 커피거리" },
        favorStatus: "FAVORED",
        applyStatus: "NOT_APPLIED"
      },
      companyRecruitStatus: "RECRUITING",
      companyRecruitDto: {
        id: 106,
        periodDto: { begin: "2025-08-01T09:00:00", end: "2025-08-15T18:00:00" },
        notice: "커피 관련 소품 및 디저트 판매 업체 모집",
        preferred: "강릉시 소재 소상공인 우대",
        categories: ["DRINK", "SNACK"]
      },
      laborRecruitStatus: "NOT_RECRUITING",
      laborRecruitDto: null
    }
  },
];


// 2. localStorage에서 데이터 불러오기 (없으면 초기 데이터 사용)
// 앱이 시작될 때 localStorage에 저장된 축제 목록을 확인합니다.
// 저장된 목록이 없으면 초기 더미 데이터를 사용하고, 있으면 저장된 데이터를 불러옵니다.
const loadFestivals = () => {
  const savedFestivals = localStorage.getItem('my-festivals');
  if (savedFestivals) {
    return JSON.parse(savedFestivals);
  }
  return initialFestivals;
};

// 3. festivals 변수를 함수 호출 결과로 초기화
let festivals = loadFestivals();

// 4. 데이터를 localStorage에 저장하는 함수
const saveFestivals = () => {
  localStorage.setItem('my-festivals', JSON.stringify(festivals));
};


export const getFestivals = () => {
  festivals = loadFestivals();
  return festivals;
};

export const getFestivalById = (id) => {
  festivals = loadFestivals();
  return festivals.find((f) => f.id === Number(id));
};

// [가장 중요한 수정] addFestival 함수
export const addFestival = (newData) => {
  // 현재 데이터를 다시 불러와 동기화합니다.
  festivals = loadFestivals();

  const newFestival = {
    id: festivals.length > 0 ? Math.max(...festivals.map(f => f.id)) + 1 : 1, // 고유한 새 ID 생성
    success: true,
    code: 200,
    message: "축제 등록에 성공하였습니다.",
    data: newData,
  };

  festivals.push(newFestival);
  // 변경된 전체 목록을 localStorage에 저장합니다.
  saveFestivals();
  
  return newFestival;
};
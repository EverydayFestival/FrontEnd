import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// 1. 제공된 API 응답 형식을 그대로 사용한 목업 데이터
const mockApiResponse = {
  "success": true,
  "code": 200,
  "message": "내가 등록한 축제 목록을 조회하는데 성공하였습니다.",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "서울 세계 불꽃 축제",
        "address": { "city": "서울특별시", "district": "영등포구", "detail": "여의도 한강공원" },
        "period": { "begin": "2025-10-05T19:20:00", "end": "2025-10-05T20:40:00" },
        "imageUrl": "https://images.unsplash.com/photo-1533283282137-b49874a4a5f4?q=80&w=870"
      },
      {
        "id": 31,
        "name": "진해 군항제",
        "address": { "city": "경상남도", "district": "창원시", "detail": "진해구 일대" },
        "period": { "begin": "2025-03-23T09:00:00", "end": "2025-04-01T22:00:00" },
        "imageUrl": "https://images.unsplash.com/photo-1585331139499-58a436c84113?q=80&w=870"
      },
      {
        "id": 52,
        "name": "부산 국제 록 페스티벌",
        "address": { "city": "부산광역시", "district": "사상구", "detail": "삼락생태공원" },
        "period": { "begin": "2025-08-09T14:00:00", "end": "2025-08-11T23:00:00" },
        "imageUrl": null // 이미지가 없는 경우도 테스트
      }
    ],
    // ... (페이지네이션 정보)
  }
};

// 날짜 형식을 'YYYY-MM-DD'로 간단하게 바꿔주는 함수
const formatDate = (dateString) => dateString.split('T')[0];

export default function SelectFestivalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId, companyName } = location.state || {};

  const [festivals, setFestivals] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');
  
  // 1. '관심 보내기'가 완료된 축제 ID들을 저장할 state 추가
  const [sentFestivalIds, setSentFestivalIds] = useState([]);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션 (이전과 동일)
    setTimeout(() => {
      if (mockApiResponse.success) {
        setFestivals(mockApiResponse.data.content);
      } else {
        setError("축제 목록을 불러오는데 실패했습니다.");
      }
      setPageLoading(false);
    }, 500);
  }, []);

  const handleSelectAndSend = async (selectedFestival) => {
    setActionLoadingId(selectedFestival.id);
    setError('');

    try {
      // 실제 API 호출 시뮬레이션 (1초 딜레이)
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`${selectedFestival.name}(ID: ${selectedFestival.id})의 관심 정보를 서버로 전송했습니다.`);
      
      // 2. API 호출 성공 후 동작 변경: alert 띄우고, sentFestivalIds에 추가
      alert('관심을 보냈습니다!');
      setSentFestivalIds(prevIds => [...prevIds, selectedFestival.id]); // 완료된 ID 목록에 추가

    } catch (err) {
      setError('요청 처리 중 오류가 발생했습니다.');
    } finally {
      setActionLoadingId(null); // 로딩 상태 해제
    }
  };

  if (pageLoading) {
    return <div className="text-center mt-20">축제 목록을 불러오는 중...</div>;
  }
  
  if (!companyId || !companyName) {
    // ... (이전과 동일한 예외 처리)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Navbar />
      <h1 className="text-3xl font-bold text-center mb-2">관심 보낼 축제 선택하기</h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        <strong className="text-blue-600">{companyName}</strong> 업체에 관심을 보낼 축제를 선택하세요.
      </p>

      <div className="space-y-4">
        {festivals.map((festival) => {
          // 4. 해당 축제가 이미 '완료' 상태인지 확인
          const isSent = sentFestivalIds.includes(festival.id);
          const isLoading = actionLoadingId === festival.id;

          return (
            // 3. 전체 아이템을 버튼이 아닌 div로 변경
            <div
              key={festival.id}
              className="w-full text-left p-4 border rounded-lg bg-white shadow-sm flex items-center gap-4"
            >
              <img 
                src={festival.imageUrl || 'https://placehold.co/100x100/e2e8f0/4a5568?text=Fest'} 
                alt={festival.name}
                className="w-24 h-24 rounded-md object-cover bg-gray-200"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{festival.name}</h3>
                <p className="text-md text-gray-500">{`${festival.address.city} ${festival.address.district}`}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {`${formatDate(festival.period.begin)} ~ ${formatDate(festival.period.end)}`}
                </p>
              </div>
              
              {/* 5. 별도의 '선택' 버튼 추가 및 조건부 렌더링 */}
              <button
                onClick={() => handleSelectAndSend(festival)}
                disabled={isSent || actionLoadingId !== null} // 이미 보냈거나 다른 요청이 진행 중이면 비활성화
                className={`
                  font-bold py-2 px-5 rounded-md transition-colors
                  ${isSent 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}
              >
                {isSent ? '완료' : (isLoading ? '...' : '선택')}
              </button>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mt-6 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
      )}
    </div>
  );
}
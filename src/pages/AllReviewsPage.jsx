import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// 업체 리뷰 API 응답 목업 데이터
const mockCompanyReviewsApi = {
  "success": true, "code": 200, "message": "성공",
  "data": {
    "content": [
      { "content": "부스 자리도 좋고 지원도 훌륭했어요!", "senderName": "지오네 닭꼬치" },
      { "content": "내년에도 꼭 참여하고 싶습니다.", "senderName": "행복한 솜사탕" },
      { "content": "역대급으로 사람이 많아서 좋았네요.", "senderName": "인생네컷 포토부스" }
    ],
    "totalElements": 5, "totalPages": 2
  }
};

// 근로자 리뷰 API 응답 목업 데이터
const mockWorkerReviewsApi = {
    "success": true, "code": 200, "message": "성공",
    "data": {
      "content": [
        { "content": "근무 환경이 만족스러웠어요.", "senderName": "근로자 B" },
        { "content": "다들 친절하시고 재밌었습니다.", "senderName": "스태프 K" }
      ],
      "totalElements": 2, "totalPages": 1
    }
  };

export default function AllReviewsPage() {
  const { id: festivalId } = useParams();
  const location = useLocation();
  const festivalName = location.state?.festivalName || "축제";

  const [activeTab, setActiveTab] = useState('company');
  const [reviews, setReviews] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 실제 앱에서는 activeTab에 따라 다른 API를 호출합니다.
    const apiResponse = activeTab === 'company' ? mockCompanyReviewsApi : mockWorkerReviewsApi;

    // API 호출 시뮬레이션
    setTimeout(() => {
      if (apiResponse.success) {
        setReviews(apiResponse.data.content);
        setTotalElements(apiResponse.data.totalElements);
      }
      setLoading(false);
    }, 300);
  }, [activeTab, festivalId]); // 탭이 바뀔 때마다 데이터 다시 불러오기

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Navbar />
      <div className="mb-6">
        <Link to={`/festival/${festivalId}`} className="text-blue-600 hover:underline">
          &larr; {festivalName} 상세 페이지로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold mt-2">전체 리뷰</h1>
      </div>
      
      <div className="flex border-b">
        <button 
          onClick={() => setActiveTab('company')}
          className={`py-2 px-4 font-semibold ${activeTab === 'company' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          업체
        </button>
        <button 
          onClick={() => setActiveTab('worker')}
          className={`py-2 px-4 font-semibold ${activeTab === 'worker' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          단기 근로자
        </button>
      </div>

      <div className="mt-4">
        <p className="text-gray-600 mb-4">총 {totalElements}개의 리뷰가 있습니다.</p>
        {loading ? (
          <p>리뷰를 불러오는 중...</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                <p className="font-semibold text-lg">{review.senderName}</p>
                <p className="text-gray-700 mt-1">"{review.content}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
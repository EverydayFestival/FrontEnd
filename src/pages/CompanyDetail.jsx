import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import CompanyReview from "../components/CompanyReview";
import FestivalCard from "../components/FestivalCard";
import Navbar from "../components/Navbar";
import fullStar from '../assets/full_star.png';
import emptyStar from '../assets/empty_star.png';
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';

export default function CompanyDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState(null);
  const [favored, setFavored] = useState(false);
  const [recommendedFestivals, setRecommendedFestivals] = useState([]);
  
  // 로딩과 에러 처리를 위한 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API 호출을 위한 비동기 함수 선언
    const fetchCompanyDetail = async () => {
      setLoading(true);
      setError(null);
      
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const companyResponse = await axios.get(`${import.meta.env.VITE_API_URL}/companies/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const companyResult = companyResponse.data;
        if (companyResult.success) {
          setCompany(companyResult.data);
          setFavored(companyResult.data.favorStatus === "FAVORED");
        } else {
          throw new Error(companyResult.message || "업체 데이터를 불러오는 데 실패했습니다.");
        }

        // 2. 추천 축제 목록 가져오기
        const recommendedResponse = await axios.get(`${import.meta.env.VITE_API_URL}/companies/${id}/recommended-festivals`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        const recommendedResult = recommendedResponse.data;
        if (recommendedResult.success) {
          setRecommendedFestivals(recommendedResult.data);
        } else {
        // 추천 축제 데이터가 없어도 에러는 발생시키지 않습니다.
          console.error("추천 축제 목록을 불러오는 데 실패했습니다:", recommendedResult.message);
          setRecommendedFestivals([]);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetail();
  }, [id]);

// 찜하기 기능
const toggleFavorite = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
    }

    // 1. API 요청 전에 UI를 먼저 업데이트하고, 원래 상태를 저장해둡니다.
    const originalFavored = favored;
    setFavored(!originalFavored);

    const method = !originalFavored ? "PUT" : "DELETE";
    const actionMessage = !originalFavored ? "찜" : "찜 취소";

    // 2. API 명세에 맞게 request body의 키 이름을 수정합니다.
    const requestBody = {
        receiverId: parseInt(id),
        receiverType: "COMPANY" // 업체 상세이므로 "COMPANY"
    };

    console.log(`${actionMessage} 요청 Body:`, JSON.stringify(requestBody, null, 2));

    try {
        // 개발 환경을 위해 '/api' 프록시 경로를 사용하도록 수정합니다.
        const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`${actionMessage}에 실패했습니다.`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || `${actionMessage}에 실패했습니다.`);
        }
        
        // 성공 시, 서버가 보내주는 최종 상태로 한 번 더 동기화합니다.
        if (result.data && typeof result.data.favored === 'boolean') {
            setFavored(result.data.favored);
        }

    } catch (err) {
        // 3. 에러가 발생하면, UI를 원래 상태로 되돌립니다.
        setFavored(originalFavored); 
        alert(err.message);
        console.error("Favorite API error:", err);
    }
};

  // 로딩 및 에러 상태에 따른 UI 렌더링
  if (loading) return <p className="text-center mt-8">로딩 중...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">에러: {error}</p>;
  if (!company) return <p className="text-center mt-8">업체를 찾을 수 없습니다.</p>;

  // API로부터 받은 company 객체를 바로 사용
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <Navbar />
      <section className="flex items-center gap-4">
        <img 
          src={company.imageUrl || '/images/manager_default.jpg'} 
          alt={company.name} 
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/96x96/e2e8f0/4a5568?text=...'; }}
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <button onClick={toggleFavorite}>
              <img
                src={favored ? fullStar : emptyStar}
                alt={favored ? "찜하기 취소" : "찜하기"}
                className="w-7 h-7"
              />
            </button>
          </div>
          <p className="text-lg text-gray-600">{company.category}</p>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg space-y-2">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">업체 정보</h2>
        <p><strong>소개:</strong> {company.introduction}</p>
        <p><strong>대표자:</strong> {company.ceoName}</p>
        <p><strong>주소:</strong> {company.address.city} {company.address.district} ({company.address.detail})</p>
        <p><strong>전화:</strong> {company.tel}</p>
        <p><strong>이메일:</strong> {company.email}</p>
        {company.link && <a href={company.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">웹사이트 바로가기</a>}
      </section>

      {/* 리뷰와 추천 축제 섹션은 기존 코드 유지 */}
      <CompanyReview reviews={[]} companyId={id} />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          이런 축제는 어떠세요?
        </h2>
        {/* 추천 축제가 0개일 때 메시지를 표시하는 조건부 렌더링 */}
        {recommendedFestivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedFestivals.map((fest) => (
              <FestivalCard
                key={fest.id}
                festival={{
                  // FestivalCard가 필요로 하는 속성 이름으로 데이터를 변환(매핑)합니다.
                  id: fest.id,
                  name: fest.name,
                  holderName: `${fest.address.city} ${fest.address.district}`,
                  imageUrl: fest.imageUrl,
                  favorStatus: "NOT_FAVORED", // 추천 축제이므로 찜 상태는 기본으로 설정
                  period: fest.period,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            등록된 추천 축제가 없습니다.
          </p>
        )}
      </section>

      {/* 조건부 렌더링: user 객체가 존재하고 역할이 'FESTIVAL_MANAGER'일 때만 버튼 표시 */}
      {user && user.role === "FESTIVAL_MANAGER" && (
        <section className="text-center">
          <p>이 업체가 마음에 드셨나요?</p>
          <Link
            to="/select-festival"
            state={{
              companyId: id,
              companyName: company.name,
            }}
            className="inline-block bg-blue-600 text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-blue-700 transition-transform hover:scale-105"
          >
            관심 보내기
          </Link>
        </section>
      )}
    </div>
  );
}


import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import CompanyReview from "../components/CompanyReview";
import FestivalCard from "../components/FestivalCard";
import Navbar from "../components/Navbar";
import fullStar from '../assets/full_star.png';
import emptyStar from '../assets/empty_star.png';
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import "../styles/CompanyDetail.css"; // CSS 파일을 import 합니다.

export default function CompanyDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState(null);
  const [favored, setFavored] = useState(false);
  const [recommendedFestivals, setRecommendedFestivals] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        const companyResult = companyResponse.data;
        if (companyResult.success) {
          setCompany(companyResult.data);
          setFavored(companyResult.data.favorStatus === "FAVORED");
        } else {
          throw new Error(companyResult.message || "업체 데이터를 불러오는 데 실패했습니다.");
        }

        const recommendedResponse = await axios.get(`${import.meta.env.VITE_API_URL}/companies/${id}/recommended-festivals`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        const recommendedResult = recommendedResponse.data;
        if (recommendedResult.success) {
          setRecommendedFestivals(recommendedResult.data);
        } else {
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

  const toggleFavorite = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
    }

    const originalFavored = favored;
    setFavored(!originalFavored);

    const method = !originalFavored ? "PUT" : "DELETE";
    const actionMessage = !originalFavored ? "찜" : "찜 취소";
    const requestBody = {
        receiverId: parseInt(id),
        receiverType: "COMPANY"
    };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || `${actionMessage}에 실패했습니다.`);
        }
        
        if (result.data && typeof result.data.favored === 'boolean') {
            setFavored(result.data.favored);
        }
    } catch (err) {
        setFavored(originalFavored); 
        alert(err.message);
        console.error("Favorite API error:", err);
    }
  };

  if (loading) return <p className="center-text">로딩 중...</p>;
  if (error) return <p className="center-text error-text">에러: {error}</p>;
  if (!company) return <p className="center-text">업체를 찾을 수 없습니다.</p>;

  return (
    <div className="content-wrapper">
      <Navbar />

      {/* 상단 이미지 + 정보 */}
      <section className="company-header">
        <img 
          src={company.imageUrl || 'https://placehold.co/208x277/e2e8f0/4a5568?text=Image'} 
          alt={company.name} 
          className="company-image"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/208x277/e2e8f0/4a5568?text=Image'; }}
        />
        <div className="company-info-side">
          <div className="company-title">
            <h1>{company.name}</h1>
            <button onClick={toggleFavorite}>
              <img
                src={favored ? fullStar : emptyStar}
                alt={favored ? "찜하기 취소" : "찜하기"}
              />
            </button>
          </div>
          {/* 추가적인 정보가 필요하다면 여기에 배치 */}
        </div>
      </section>

      {/* 업체 상세 정보 */}
      <section className="company-details-info">
        <div className="info-item">
            <span className="info-label">장소</span>
            <span className="info-value">{company.address.city} {company.address.district}</span>
        </div>
        <div className="info-item">
            <span className="info-label">분야</span>
            <span className="info-value">{company.category}</span>
        </div>
        <div className="info-item">
            <span className="info-label">업체소개</span>
            <span className="info-value">{company.introduction}</span>
        </div>
        <div className="info-item">
            <span className="info-label">대표자</span>
            <span className="info-value">{company.ceoName}</span>
        </div>
        <div className="info-item">
            <span className="info-label">연락처</span>
            <span className="info-value">{company.tel}</span>
        </div>
        <div className="info-item">
            <span className="info-label">이메일</span>
            <span className="info-value">{company.email}</span>
        </div>
        {company.link && (
            <div className="info-item">
                <span className="info-label">공식사이트</span>
                <span className="info-value">
                    <a href={company.link} target="_blank" rel="noopener noreferrer">{company.link}</a>
                </span>
            </div>
        )}
      </section>

      {/* 리뷰 보기 */}
      <section className="company-reviews">
        <h2>리뷰 보기</h2>
        <CompanyReview companyId={id} />
      </section>

      {/* 추천 축제 */}
      <section className="recommended-festivals">
        <h2>축제를 추천해드릴게요</h2>
        {recommendedFestivals.length > 0 ? (
          <div className="recommended-grid">
            {recommendedFestivals.map((fest) => (
              <FestivalCard
                key={fest.id}
                festival={{
                  id: fest.id,
                  name: fest.name,
                  holderName: `${fest.address.city} ${fest.address.district}`,
                  imageUrl: fest.imageUrl,
                  favorStatus: "NOT_FAVORED",
                  period: fest.period,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="no-recommendations">등록된 추천 축제가 없습니다.</p>
        )}
      </section>

      {/* 관심 보내기 버튼 */}
      {user && user.role === "축제기획자" && (
        <section className="interest-section">
          <p>이 업체가 마음에 드셨나요?</p>
          <Link
            to="/select-festival"
            state={{
              companyId: id,
              companyName: company.name,
            }}
            className="interest-button"
          >
            관심 표현하기
          </Link>
        </section>
      )}
    </div>
  );
}
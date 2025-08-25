import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // useNavigate 대신 Link 사용
import "../styles/CompanyReview.css"

export default function CompanyReview({ companyId }) {
  // 1. 상태 관리와 API 호출 로직은 기존과 동일합니다.
  const [reviews, setReviews] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CompanyReview.jsx

// ... (다른 상태값들은 그대로)

  // 2. companyId가 변경될 때마다 API를 호출합니다.
  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    const fetchPreviewReviews = async () => {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("리뷰를 보려면 로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/companies/${companyId}/reviews?page=0&size=3`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) {
          throw new Error("리뷰를 불러오는 데 실패했습니다.");
        }

        const result = await response.json();
        if (result.success) {
          setReviews(result.data.content);
          setTotalElements(result.data.totalElements);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }; // fetchPreviewReviews 함수 끝

    fetchPreviewReviews(); // <-- if(companyId)는 불필요하여 제거

  }, [companyId]); // <-- 여기에 }; 와 ) 를 정확히 추가하여 useEffect를 닫아줍니다.


  // 2. 렌더링할 내용을 결정하는 함수 (가독성을 위해 분리)
  const renderContent = () => {
    if (loading) {
      return <p className="review-message">리뷰를 불러오는 중...</p>;
    }

    if (error) {
      return <p className="review-message error">{error}</p>;
    }

    if (reviews.length === 0) {
      return <p className="review-message">작성된 리뷰가 없습니다.</p>;
    }
    // 성공 시 리뷰 목록과 더보기 버튼을 함께 렌더링
    return (
      <>
        <div className="review-list-container">
          {reviews.map((review) => (
            <div key={review.id || review.senderName} className="review-card">
              {/* 아바타 (프로필 아이콘) */}
              <div className="review-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
      </div>
              {/* 말풍선 부분 */}
              <div className="review-bubble">
                <p className="review-sender">{review.senderName}</p>
                <div className="review-content">
                  <p className="review-text">{review.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 전체 리뷰가 3개 초과일 때만 '더보기' 버튼 표시 */}
        {totalElements > 3 && (
          <div className="review-more">
            <Link to={`/company/${companyId}/reviews`} className="more-button">
              리뷰 더 보기 ({totalElements})
            </Link>
          </div>
        )}
      </>
    );
  };

  // 3. 최종 JSX 구조
  return (
    <section className="company-review-section">
      <div className="section-header">
    </div>
      {renderContent()}
    </section>
  );
}
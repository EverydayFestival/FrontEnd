import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyReview({ companyId }) {
  const navigate = useNavigate();

  // 1. 리뷰 데이터, 로딩, 에러, 전체 개수 상태를 관리합니다.
  const [reviews, setReviews] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. companyId가 변경될 때마다 API를 호출합니다.
  useEffect(() => {
    // API 호출 함수
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
        // API를 호출하여 3개만 미리보기로 가져옵니다.
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
          setTotalElements(result.data.totalElements); // "더보기" 버튼 표시를 위해 전체 개수를 저장
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchPreviewReviews();
    }
  }, [companyId]); // companyId prop이 바뀔 때마다 다시 실행

  // 3. 로딩 및 에러 상태에 따른 UI를 렌더링합니다.
  const renderReviewList = () => {
    if (loading) {
      return <p className="text-gray-500">리뷰를 불러오는 중...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (reviews.length === 0) {
      return <p>작성된 리뷰가 없습니다.</p>;
    }

    // API 응답에 맞춰 `senderName`과 `content`를 사용하고, id가 없으므로 `index`를 key로 사용합니다.
    return reviews.map((review, index) => (
      <div key={index} className="border p-3 rounded-md shadow-sm bg-gray-50">
        <p className="font-semibold text-gray-800">{review.senderName}</p>
        <p className="text-gray-600 mt-1">"{review.content}"</p>
      </div>
    ));
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">업체 리뷰</h2>

      {/* 리뷰 리스트 */}
      <div className="space-y-3">{renderReviewList()}</div>

      {/* 더보기 버튼: 전체 리뷰가 3개 초과일 때만 보입니다. */}
      {totalElements > 3 && !loading && (
        <button
          className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => navigate(`/company/${companyId}/reviews`)}
        >
          리뷰 더보기
        </button>
      )}
    </div>
  );
}
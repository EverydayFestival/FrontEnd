import React from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyReview({ reviews, festivalId }) {
  const navigate = useNavigate();

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-semibold mb-4">업체 리뷰</h2>

      {/* 리뷰 리스트 */}
      <div className="space-y-2">
        {reviews.slice(0, 3).map((r) => (
          <div key={r.id} className="border p-2 rounded">
            <p className="font-semibold">{r.author}</p>
            <p>{r.content}</p>
          </div>
        ))}
        {reviews.length === 0 && <p>리뷰가 없습니다.</p>}
      </div>

      {/* 더보기 버튼 */}
      {reviews.length > 3 && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate(`/festivals/${festivalId}/reviews`)}
        >
          리뷰 더보기
        </button>
      )}
    </div>
  );
}

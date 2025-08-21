import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FestivalReview({ reviews, festivalId }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all / company / worker

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.type === filter);

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-semibold mb-4">축제 리뷰</h2>
      {/* 필터 탭 */}
      <div className="flex gap-4 mb-4">
        {["all", "company", "worker"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${
              filter === f ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {f === "all" ? "전체" : f === "company" ? "업체 리뷰" : "근로자 리뷰"}
          </button>
        ))}
      </div>

      {/* 리뷰 리스트 */}
      <div className="space-y-2">
        {filteredReviews.slice(0, 3).map((r) => (
          <div key={r.id} className="border p-2 rounded">
            <p className="font-semibold">{r.author}</p>
            <p>{r.content}</p>
          </div>
        ))}
        {filteredReviews.length === 0 && <p>리뷰가 없습니다.</p>}
      </div>

      {/* 더보기 버튼 */}
      {filteredReviews.length > 3 && (
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

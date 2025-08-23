import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

function FestivalCard({ festival }) {
  const navigate = useNavigate();

  // festival 객체가 유효한지 확인합니다.
  if (!festival) {
    return null; // 데이터가 없으면 렌더링하지 않습니다.
  }

  const handleClick = () => {
    // mainPageData의 festivalId를 사용해 상세 페이지로 이동합니다.
    navigate(`/festivals/${festival.id}`);
  };

  const isFavored = festival.favorStatus === "FAVORED";

  return (
    <div
      className="festival-card cursor-pointer border rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
      onClick={handleClick}
    >
      {/* 이미지가 없으므로 기본 이미지를 표시합니다. */}
      <img
        className="w-full h-48 object-cover"
        src={festival.imageUrl || "/images/festival_default.jpg"} 
        alt={festival.name}
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/e2e8f0/4a5568?text=Festival'; }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold mb-1">{festival.name}</h3>
            {/* favored 상태에 따라 별 아이콘을 표시합니다. */}
            {isFavored ? (
                <FaStar className="text-yellow-400 flex-shrink-0" />
            ) : (
                <FaRegStar className="text-gray-400 flex-shrink-0" />
            )}
        </div>
        {/* festivalOrganization을 표시합니다. */}
        <p className="text-gray-600 text-sm">{festival.holderName}</p>
        <p className="text-sm text-gray-500 mt-2">
          시작일: {new Date(festival.period.begin).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default FestivalCard;

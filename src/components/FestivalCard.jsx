import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

function FestivalCard({ festival }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [isFavored, setIsFavored] = useState(festival.favorStatus === "FAVORED");

  // festival 객체가 유효한지 확인합니다.
  if (!festival) {
    return null; // 데이터가 없으면 렌더링하지 않습니다.
  }

  const handleClick = () => {
    // mainPageData의 festivalId를 사용해 상세 페이지로 이동합니다.
    navigate(`/festivals/${festival.id}`);
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation(); // ✅ 카드 클릭 이벤트가 상위로 전파되는 것을 막습니다.

  // 로그인 상태 확인
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const originalFavored = isFavored;
    setIsFavored(!originalFavored); // UI를 먼저 업데이트하여 사용자에게 즉각적인 피드백을 줍니다.

    const method = !originalFavored ? "PUT" : "DELETE";
    const requestBody = {
      receiverId: festival.id,
      receiverType: "FESTIVAL",
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("찜 상태 변경에 실패했습니다.");
      }

      // 서버 응답에서 새로운 찜 상태를 받아와 최종적으로 상태를 업데이트합니다.
      const result = await response.json();
      if (result.data && typeof result.data.favored === 'boolean') {
        setIsFavored(result.data.favored);
      }
    } catch (err) {
      // 4. 오류 발생 시, UI 상태를 원래대로 되돌립니다.
      setIsFavored(originalFavored);
      alert(err.message);
      console.error("Favorite API error:", err);
    }
  };

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
            {/* 5. 찜하기 버튼 추가 */}
          <button onClick={toggleFavorite} className="z-10 relative">
            {isFavored ? (
              <FaStar className="text-yellow-400 flex-shrink-0 w-6 h-6" />
            ) : (
              <FaRegStar className="text-gray-400 flex-shrink-0 w-6 h-6" />
            )}
          </button>
        </div>
        {/* festivalOrganization을 표시합니다. */}
        <p className="text-gray-600 text-sm">{festival.holderName}</p>
        <p className="text-sm text-gray-500 mt-2">
                    {festival.period ? 
                        `${new Date(festival.period.begin).toLocaleDateString()} ~ ${new Date(festival.period.end).toLocaleDateString()}` 
                        : '기간 정보 없음'
                    }
                </p>
      </div>
    </div>
  );
}

export default FestivalCard;

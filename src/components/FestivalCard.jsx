import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "../styles/FestivalCard.css"

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
    <div className="festival-wrapper">
    <div
  className="festival-card"
  onClick={handleClick}
>
  <img
    src={festival.imageUrl || "/images/festival_default.jpg"}
    alt={festival.name}
    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/344x246/e2e8f0/4a5568?text=Festival'; }}
  />
  <button className="favorite-btn" onClick={toggleFavorite}>
    {isFavored ? <FaStar className="text-yellow-400"/> : <FaRegStar className="text-gray-400"/>}
  </button>
  <div className="festival-info">
    <h3>{festival.name}</h3>
    <p>{festival.holderName}</p>
    <p className="period">
      {festival.period 
        ? `${new Date(festival.period.begin).toLocaleDateString()} ~ ${new Date(festival.period.end).toLocaleDateString()}` 
        : '기간 정보 없음'}
    </p>
  </div>
</div>
</div>

  );
}

export default FestivalCard;

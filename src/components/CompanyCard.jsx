import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "../styles/CompanyCard.css";

function CompanyCard({ company }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isFavored, setIsFavored] = useState(company.favored);

  if (!company) return null;

  const handleClick = () => {
    navigate(`/company/${company.companyId}`);
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const originalFavored = isFavored;
    setIsFavored(!originalFavored);

    const method = !originalFavored ? "PUT" : "DELETE";
    const requestBody = {
      receiverId: company.companyId,
      receiverType: "COMPANY",
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
        method,
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("찜 상태 변경에 실패했습니다.");
      const result = await response.json();
      if (result.data && typeof result.data.favored === "boolean") {
        setIsFavored(result.data.favored);
      }
    } catch (err) {
      setIsFavored(originalFavored);
      alert(err.message);
      console.error("Favorite API error:", err);
    }
  };

  return (
    <div className="company-card" onClick={handleClick}>
  <img
    src={company.imageUrl || "/images/company_default.jpg"}
    alt={company.companyName}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "https://placehold.co/344x246/e2e8f0/4a5568?text=Company";
    }}
  />
  <button className="favorite-btn" onClick={toggleFavorite}>
    {isFavored ? <FaStar /> : <FaRegStar />}
  </button>
  <div className="festival-info"> {/* 1. 클래스 이름을 "festival-info"로 변경 */}
      <h3>{company.companyName}</h3>
      <p>{company.companyCategory}</p> {/* 2. 두 번째 줄에 표시할 정보 (예: 카테고리) */}
      <p className="period"> {/* 3. 세 번째 줄에 "period" 클래스 추가 */}
        {company.companyCity} {company.companyDistrict} {/* 3. 세 번째 줄에 표시할 정보 (예: 지역) */}
      </p>
    </div>
</div>

  );
}

export default CompanyCard;

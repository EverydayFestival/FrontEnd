import React, { useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

// 이제 'manager' 대신 'company' 객체를 prop으로 받습니다.
function CompanyCard({ company }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // 1. 초기 찜 상태를 props에서 가져와 로컬 상태로 관리합니다.
  const [isFavored, setIsFavored] = useState(company.favored);

  // company 객체가 유효한지 확인합니다.
  if (!company) {
    return null; // 데이터가 없으면 렌더링하지 않습니다.
  }

  const handleClick = () => {
    // companyId를 사용해 상세 페이지로 이동합니다.
    // 경로는 기존과 같이 /company/를 사용한다고 가정합니다.
    navigate(`/company/${company.companyId}`);
  };

  // 3. 찜하기/찜 취소 API를 호출하는 함수
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
      receiverId: company.companyId,
      receiverType: "COMPANY",
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
      className="company-card cursor-pointer border rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
      onClick={handleClick}
    >
      {/* 업체 이미지가 없을 경우를 대비한 기본 이미지 */}
      <img
        className="w-full h-48 object-cover"
        src={company.imageUrl || "/images/company_default.jpg"}
        alt={company.companyName}
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/e2e8f0/4a5568?text=Company'; }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          {/* companyName으로 업체 이름을 표시합니다. */}
          <h3 className="text-lg font-bold mb-1">{company.companyName}</h3>
          {/* favored 상태에 따라 별 아이콘을 표시합니다. */}
          {/* 5. 찜하기 버튼 추가 */}
          <button onClick={toggleFavorite} className="z-10 relative">
            {isFavored ? (
              <FaStar className="text-yellow-400 flex-shrink-0 w-6 h-6" />
            ) : (
              <FaRegStar className="text-gray-400 flex-shrink-0 w-6 h-6" />
            )}
          </button>
        </div>
        {/* companyCategory와 companyCity를 표시합니다. */}
        <p className="text-sm text-gray-500 mt-2">{company.companyCity} {company.companyDistrict}</p>
        <p className="text-gray-600 text-sm">{company.companyCategory}</p>
      </div>
    </div>
  );
}

export default CompanyCard;

import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

// 이제 'manager' 대신 'company' 객체를 prop으로 받습니다.
function CompanyCard({ company }) {
  const navigate = useNavigate();

  // company 객체가 유효한지 확인합니다.
  if (!company) {
    return null; // 데이터가 없으면 렌더링하지 않습니다.
  }

  const handleClick = () => {
    // companyId를 사용해 상세 페이지로 이동합니다.
    // 경로는 기존과 같이 /company/를 사용한다고 가정합니다.
    navigate(`/company/${company.companyId}`);
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
          {company.favored ? (
            <FaStar className="text-yellow-400 flex-shrink-0" />
          ) : (
            <FaRegStar className="text-gray-400 flex-shrink-0" />
          )}
        </div>
        {/* companyCategory와 companyCity를 표시합니다. */}
        <p className="text-gray-600 text-sm">{company.companyCategory}</p>
        <p className="text-sm text-gray-500 mt-2">{company.companyCity}</p>
      </div>
    </div>
  );
}

export default CompanyCard;

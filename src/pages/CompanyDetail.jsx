import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { companies } from "../assets/company/companies"; // 더 이상 사용하지 않으므로 삭제 또는 주석 처리
import { festivals } from "../data/recommendedFestivals";
import CompanyReview from "../components/CompanyReview";
import FestivalCard from "../components/FestivalCard";
import { FaStar, FaRegStar } from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [favored, setFavored] = useState(false);
  
  // 로딩과 에러 처리를 위한 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API 호출을 위한 비동기 함수 선언
    const fetchCompanyDetail = async () => {
      setLoading(true);
      setError(null);
      
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/companies/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP 에러! 상태: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          // API 응답의 data 객체를 company 상태에 저장
          setCompany(result.data);
          // favorStatus 값에 따라 favored 상태 설정
          setFavored(result.data.favorStatus === "FAVORED");
        } else {
          throw new Error(result.message || "데이터를 불러오는 데 실패했습니다.");
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetail();
  }, [id]); // id가 변경될 때마다 API를 다시 호출

  // 찜하기 기능 (로컬 상태만 변경, 실제 API 연동 필요)
  const toggleFavorite = () => {
    // TODO: 여기에 찜하기 상태를 서버에 업데이트하는 API 호출 로직을 추가해야 합니다.
    setFavored((prev) => !prev);
  };

  // 로딩 및 에러 상태에 따른 UI 렌더링
  if (loading) return <p className="text-center mt-8">로딩 중...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">에러: {error}</p>;
  if (!company) return <p className="text-center mt-8">업체를 찾을 수 없습니다.</p>;

  // API로부터 받은 company 객체를 바로 사용
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <Navbar />
      <section className="flex items-center gap-4">
        <img 
          src={company.imageUrl || '/images/manager_default.jpg'} 
          alt={company.name} 
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/96x96/e2e8f0/4a5568?text=...'; }}
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <button onClick={toggleFavorite}>
              {favored ? (
                <FaStar size={28} className="text-yellow-400" />
              ) : (
                <FaRegStar size={28} className="text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-lg text-gray-600">{company.category}</p>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg space-y-2">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">업체 정보</h2>
        <p><strong>소개:</strong> {company.introduction}</p>
        <p><strong>대표자:</strong> {company.ceoName}</p>
        <p><strong>주소:</strong> {company.address.city} {company.address.district} ({company.address.detail})</p>
        <p><strong>전화:</strong> {company.tel}</p>
        <p><strong>이메일:</strong> {company.email}</p>
        {company.link && <a href={company.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">웹사이트 바로가기</a>}
      </section>

      {/* 리뷰와 추천 축제 섹션은 기존 코드 유지 */}
      <CompanyReview reviews={[]} companyId={id} />

       <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          이런 축제는 어떠세요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {festivals.slice(0, 3).map((fest) => (
            <FestivalCard
              key={fest.festivalId}
              festival={{
                // FestivalCard가 필요로 하는 속성 이름으로 데이터를 변환(매핑)합니다.
                id: fest.festivalId,
                name: fest.festivalName,
                holderName: fest.festivalOrganization,
                imageUrl: fest.imageUrl,
                favorStatus: fest.favored, // 'FAVORED' 또는 'NOT_FAVORED'
                period: {
                  begin: fest.festivalHoldBegin // period 객체 안에 begin 속성을 만들어 전달
                }
              }}
            />
          ))}
        </div>
      </section>

      <section className="text-center">
        <p>이 업체가 마음에 드셨나요?</p>
        <Link
          to="/select-festival"
          state={{
            companyId: id, 
            companyName: company.name 
          }}
          className="inline-block bg-blue-600 text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-blue-700 transition-transform hover:scale-105"
        >
          관심 보내기
        </Link>
      </section>
    </div>
  );
}
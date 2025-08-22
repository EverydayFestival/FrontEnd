import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { FestivalContext } from "../context/FestivalContext.jsx";
import { companies } from "../data/recommendedCompanies.js";
import CompanyCard from "../components/CompanyCard";
import FestivalReview from "../components/FestivalReview";
import { FaStar, FaRegStar } from "react-icons/fa";

function RecruitCard({ type, recruitInfo, festivalId }) {
  const navigate = useNavigate();

  if (!recruitInfo) return null;

  const today = new Date();
  const endDate = new Date(recruitInfo.periodDto.end);
  const isRecruiting = today <= endDate ? "모집 중" : "모집 완료";

  const handleGoRecruit = () => {
    // [수정 1] 모집 공고의 ID가 아닌, 축제 ID를 URL로 전달합니다.
    // 이렇게 해야 RecruitCompany/Worker 페이지에서 올바른 축제 정보를 찾을 수 있습니다.
    navigate(`/recruit/${type}/${festivalId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">
          {type === "company" ? "업체 모집" : "단기 근로자 모집"}
        </h3>
        <span className={`px-3 py-1 rounded ${isRecruiting === "모집 중" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"} font-semibold`}>
          {isRecruiting}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        모집 기간: {new Date(recruitInfo.periodDto.begin).toLocaleDateString()} ~ {new Date(recruitInfo.periodDto.end).toLocaleDateString()}
      </p>
      <p className="mt-2 text-gray-700"><strong>공지:</strong> {recruitInfo.notice}</p>
      
      {type === "company" ? (
        <>
          <p><strong>분야:</strong> {recruitInfo.categories.join(", ")}</p>
          <p><strong>우대사항:</strong> {recruitInfo.preferred}</p>
        </>
      ) : (
        <>
          <p><strong>업무:</strong> {recruitInfo.job}</p>
          <p><strong>임금:</strong> {recruitInfo.wage}</p>
          <p><strong>특이사항:</strong> {recruitInfo.remark}</p>
        </>
      )}
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4 w-full hover:bg-blue-600 transition-colors" onClick={handleGoRecruit}>
        공고 확인 및 지원하기
      </button>
    </div>
  );
}

export default function FestivalDetail() {
    const { getFestivalById } = useContext(FestivalContext);
    const { id } = useParams();
    const [festivalData, setFestivalData] = useState(null);
    const [favored, setFavored] = useState(false);

    useEffect(() => {
        const found = getFestivalById(id);
        if (found && found.success) {
            setFestivalData(found.data);
            setFavored(found.data.festivalOnlyDto.favorStatus === "FAVORED");
        }
    }, [id, getFestivalById]); // getFestivalById도 의존성 배열에 추가

    if (!festivalData) return <p className="text-center mt-8">축제를 찾을 수 없습니다.</p>;

    const info = festivalData;
    const festivalInfo = info.festivalOnlyDto;

    const today = new Date();
    const endDate = new Date(festivalInfo.periodDto.end);
    const beginDate = new Date(festivalInfo.periodDto.begin);
    const isOngoing = today >= beginDate && today <= endDate;

    const reviews = [
        { id: 1, type: "company", author: "지오네 닭꼬치", content: "좋은 경험이었습니다."},
        { id: 2, type: "worker", author: "근로자 B", content: "근무 환경이 만족스러웠어요." },
    ];

    const diffTime = beginDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let dDay = "";
    if (isOngoing) {
        dDay = "진행 중";
    } else if (diffDays > 0) {
        dDay = `D-${diffDays}`;
    } else {
        dDay = "행사 종료";
    }

    const isEnded = today > endDate;

    const toggleFavorite = () => {
      setFavored((prev) => !prev);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-8">
            <section className="flex items-center gap-4">
                <img 
                    src={festivalInfo.imageUrl || '/images/festival_default.jpg'} 
                    alt={festivalInfo.name} 
                    className="w-32 h-32 rounded-lg object-cover border"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/e2e8f0/4a5568?text=...'; }}
                />
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold">{festivalInfo.name}</h1>
                        <button onClick={toggleFavorite}>
                            {favored ? (
                                <FaStar size={28} className="text-yellow-400" />
                            ) : (
                                <FaRegStar size={28} className="text-gray-400" />
                            )}
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <span className={`px-3 py-1 rounded ${isOngoing ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"} font-semibold`}>
                            {isOngoing ? "진행 중" : "진행 예정/종료"}
                        </span>
                        <span className="px-3 py-1 rounded bg-blue-200 text-blue-800 font-semibold">
                            {dDay}
                        </span>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg space-y-2">
                <h2 className="text-xl font-semibold mb-3 border-b pb-2">축제 정보</h2>
                <p><strong>기간:</strong> {new Date(festivalInfo.periodDto.begin).toLocaleDateString()} ~ {new Date(festivalInfo.periodDto.end).toLocaleDateString()}</p>
                <p><strong>장소:</strong> {festivalInfo.addressDto.city} {festivalInfo.addressDto.district} ({festivalInfo.addressDto.detail})</p>
                <p><strong>참가비:</strong> {festivalInfo.fee}</p>
                <p><strong>시간:</strong> {festivalInfo.time}</p>
                <p className="mt-2"><strong>소개:</strong> {festivalInfo.introduction}</p>
                <p className="mt-2"><strong>주최:</strong> {festivalInfo.holderName}</p>
                <p><strong>문의:</strong> {festivalInfo.tel}</p>
                <a href={festivalInfo.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    공식 홈페이지 바로가기
                </a>
            </section>

            {(info.companyRecruitStatus === "RECRUITING" || info.laborRecruitStatus === "RECRUITING") && (
                <section>
                    <h2 className="text-2xl font-semibold">참여자 모집</h2>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        {info.companyRecruitStatus === "RECRUITING" && (
                            <RecruitCard type="company" recruitInfo={info.companyRecruitDto} festivalId={id} />
                        )}
                        {info.laborRecruitStatus === "RECRUITING" && (
                            <RecruitCard type="worker" recruitInfo={info.laborRecruitDto} festivalId={id} />
                        )}
                    </div>
                </section>
            )}

            {isEnded && <FestivalReview reviews={reviews} festivalId={id}/>}
            
            <section>
                <h2 className="text-2xl font-semibold mb-4">
                    이런 업체는 어떠세요?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* [수정 2] recommendedCompanies.js의 데이터 구조에 맞게 props를 전달합니다. */}
                    {companies.slice(0, 3).map((company) => (
                        <CompanyCard
                            key={company.id}
                            company={{
                                companyId: company.id,
                                companyName: company.name,
                                companyCategory: company.category,
                                companyCity: company.city,
                                favored: company.favored === 'FAVORED',
                                imageUrl: company.imageUrl
                            }}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

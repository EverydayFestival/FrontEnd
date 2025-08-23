import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { FestivalContext } from "../context/FestivalContext.jsx";
import { companies } from "../data/recommendedCompanies.js";
import CompanyCard from "../components/CompanyCard";
import FestivalReview from "../components/FestivalReview";
import { FaStar, FaRegStar } from "react-icons/fa";
import Navbar from "../components/Navbar.jsx";

const StarFilledIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-yellow-400">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);
const StarOutlineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

function RecruitCard({ type, recruitInfo, festivalId }) {
    const navigate = useNavigate();
    if (!recruitInfo) return null;

    const today = new Date();
    const endDate = new Date(recruitInfo.period.end);
    const isRecruiting = today <= endDate;

    const handleGoRecruit = () => {
        navigate(`/recruit/${type}/${festivalId}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{type === "company" ? "업체 모집" : "단기 근로자 모집"}</h3>
                <span className={`px-3 py-1 rounded ${isRecruiting ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"} font-semibold`}>
                    {isRecruiting ? "모집 중" : "모집 완료"}
                </span>
            </div>
            <p className="text-sm text-gray-600">모집 기간: {new Date(recruitInfo.period.begin).toLocaleDateString()} ~ {new Date(recruitInfo.period.end).toLocaleDateString()}</p>
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
    const { id } = useParams();
    const [festivalData, setFestivalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favored, setFavored] = useState(false);

    useEffect(() => {
        const fetchFestivalDetail = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/festivals/${id}`, {
                    method: 'GET', // GET 메서드 명시
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setFestivalData(result.data);
                    setFavored(result.data.festivalOnlyDto.favorStatus === "FAVORED");
                } else {
                    throw new Error(result.message || "데이터를 불러오는 데 실패했습니다.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFestivalDetail();
    }, [id]);

    if (loading) return <p className="text-center mt-8">로딩 중...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">에러: {error}</p>;
    if (!festivalData) return <p className="text-center mt-8">축제를 찾을 수 없습니다.</p>;

    const festivalInfo = festivalData.festivalOnlyDto;
    const today = new Date();
    const endDate = new Date(festivalInfo.period.end);
    const beginDate = new Date(festivalInfo.period.begin);
    const isOngoing = today >= beginDate && today <= endDate;
    const diffDays = Math.ceil((beginDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let dDay = "";
    if (isOngoing) dDay = "진행 중";
    else if (diffDays > 0) dDay = `D-${diffDays}`;
    else dDay = "행사 종료";

    const isEnded = today > endDate;

    const toggleFavorite = () => {
        setFavored((prev) => !prev);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-8">
            <Navbar />
            <section className="flex items-center gap-4">
                <img 
                    src={festivalInfo.imageUrl || `https://placehold.co/128x128/e2e8f0/4a5568?text=${festivalInfo.name}`} 
                    alt={festivalInfo.name} 
                    className="w-32 h-32 rounded-lg object-cover border"
                />
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold">{festivalInfo.name}</h1>
                        <button onClick={toggleFavorite}>
                            {favored ? <StarFilledIcon /> : <StarOutlineIcon />}
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <span className={`px-3 py-1 rounded ${isOngoing ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"} font-semibold`}>
                            {isOngoing ? "진행 중" : "진행 예정/종료"}
                        </span>
                        <span className="px-3 py-1 rounded bg-blue-200 text-blue-800 font-semibold">{dDay}</span>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg space-y-2">
                <h2 className="text-xl font-semibold mb-3 border-b pb-2">축제 정보</h2>
                <p><strong>기간:</strong> {new Date(festivalInfo.period.begin).toLocaleDateString()} ~ {new Date(festivalInfo.period.end).toLocaleDateString()}</p>
                <p><strong>장소:</strong> {festivalInfo.address.city} {festivalInfo.address.district} ({festivalInfo.address.detail})</p>
                <p><strong>참가비:</strong> {festivalInfo.fee}</p>
                <p><strong>시간:</strong> {festivalInfo.time}</p>
                <p className="mt-2"><strong>소개:</strong> {festivalInfo.introduction}</p>
                <p className="mt-2"><strong>주최:</strong> {festivalInfo.holderName}</p>
                <p><strong>문의:</strong> {festivalInfo.tel}</p>
                <a href={festivalInfo.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    공식 홈페이지 바로가기
                </a>
            </section>

            {(festivalData.companyRecruitStatus === "RECRUITING" || festivalData.laborRecruitStatus === "RECRUITING") && (
                <section>
                    <h2 className="text-2xl font-semibold">참여자 모집</h2>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        {festivalData.companyRecruitStatus === "RECRUITING" && (
                            <RecruitCard type="company" recruitInfo={festivalData.companyRecruitDto} festivalId={id} />
                        )}
                        {festivalData.laborRecruitStatus === "RECRUITING" && (
                            <RecruitCard type="worker" recruitInfo={festivalData.laborRecruitDto} festivalId={id} />
                        )}
                    </div>
                </section>
            )}

            {isEnded && <FestivalReview reviews={[]} festivalId={id}/>}
            
            <section>
                <h2 className="text-2xl font-semibold mb-4">이런 업체는 어떠세요?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {/* 추천 업체 목록 API 연동 필요 */}
                </div>
            </section>
        </div>
    );
}

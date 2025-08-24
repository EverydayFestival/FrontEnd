import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import CompanyCard from "../components/CompanyCard";
import FestivalReview from "../components/FestivalReview";
import Navbar from "../components/Navbar.jsx";
import fullStar from '../assets/full_star.png';
import emptyStar from '../assets/empty_star.png';
import { AuthContext } from "../context/AuthContext.jsx";

function RecruitCard({ type, recruitInfo, festivalId, applyStatus, userRole }) {
    const navigate = useNavigate();
    if (!recruitInfo) return null;

    const today = new Date();
    const endDate = new Date(recruitInfo.period.end);
    const isRecruiting = today <= endDate;

    const hasApplied = applyStatus === "APPLIED";

    let canApply = true;

    if (userRole === "축제기획자") {
        canApply = false;
    } else if (userRole === "업체" && type === "worker") {
        canApply = false;
    } else if (userRole === "단기근로자" && type === "company") {
        canApply = false;
    }

    const isDisabled = hasApplied || !canApply || !isRecruiting;

    const handleButtonClick = () => {
        if (!isDisabled) {
            navigate(`/recruit/${type}/${festivalId}`);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">
                    {type === "company" ? "업체 모집" : "단기 근로자 모집"}
                </h3>
                <span
                    className={`px-3 py-1 rounded ${
                        isRecruiting
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                    } font-semibold`}
                >
                    {isRecruiting ? "모집 중" : "모집 완료"}
                </span>
            </div>
            <p className="text-sm text-gray-600">
                모집 기간: {new Date(recruitInfo.period.begin).toLocaleDateString()} ~{" "}
                {new Date(recruitInfo.period.end).toLocaleDateString()}
            </p>
            <p className="mt-2 text-gray-700">
                <strong>공지:</strong> {recruitInfo.notice}
            </p>

            {type === "company" ? (
                <>
                    <p>
                        <strong>분야:</strong> {recruitInfo.categories.join(", ")}
                    </p>
                    <p>
                        <strong>우대사항:</strong> {recruitInfo.preferred}
                    </p>
                </>
            ) : (
                <>
                    <p>
                        <strong>업무:</strong> {recruitInfo.job}
                    </p>
                    <p>
                        <strong>임금:</strong> {recruitInfo.wage}
                    </p>
                    <p>
                        <strong>특이사항:</strong> {recruitInfo.remark}
                    </p>
                </>
            )}

            <button
                className={`px-4 py-2 rounded-lg mt-4 w-full font-semibold transition-colors
                    ${
                        isDisabled
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                onClick={isDisabled ? null : handleButtonClick}
                disabled={isDisabled}
            >
                {hasApplied
                    ? "이미 지원 완료"
                    : !canApply
                    ? "지원 불가"
                    : !isRecruiting
                    ? "모집 기간 종료"
                    : "공고 확인 및 지원하기"}
            </button>
        </div>
    );
}

export default function FestivalDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [festivalData, setFestivalData] = useState(null);
    const [recommendedCompanies, setRecommendedCompanies] = useState([]);
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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    console.log("📌 Festival Detail Data:", result.data);
                    setFestivalData(result.data);
                    setFavored(result.data.festivalOnlyDto.favorStatus === "FAVORED");
                } else {
                    throw new Error(result.message || "데이터를 불러오는 데 실패했습니다.");
                }

                const recommendedResponse = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${id}/recommended-companies`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                if (!recommendedResponse.ok) {
                    throw new Error(`HTTP error! status: ${recommendedResponse.status}`);
                }

                const recommendedResult = await recommendedResponse.json();
                if (recommendedResult.success) {
                    console.log("📌 Recommended Companies Data:", recommendedResult.data);
                    setRecommendedCompanies(recommendedResult.data);
                } else {
                    throw new Error(recommendedResult.message || "추천 업체 목록을 불러오는 데 실패했습니다.");
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
    const endDate = festivalInfo.period ? new Date(festivalInfo.period.end) : null;
    const beginDate = festivalInfo.period ? new Date(festivalInfo.period.begin) : null;

    const isOngoing = beginDate && endDate && today >= beginDate && today <= endDate;
    const diffDays = beginDate ? Math.ceil((beginDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
    
    let dDay = "";
    if (isOngoing) dDay = "진행 중";
    else if (diffDays !== null && diffDays > 0) dDay = `D-${diffDays}`;
    else dDay = "행사 종료";

    const isEnded = endDate ? today > endDate : false;

    const toggleFavorite = async () => {
        console.log("찜하기 클릭! 현재 URL의 id:", id); 
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        const originalFavored = favored;
        setFavored(!originalFavored);
        
        const method = !originalFavored ? "PUT" : "DELETE";
        const actionMessage = !originalFavored ? "찜" : "찜 취소";

        const requestBody = {
            receiverId: parseInt(id),
            receiverType: "FESTIVAL"
        };

        console.log(`${actionMessage} 요청 Body:`, JSON.stringify(requestBody, null, 2));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`${actionMessage}에 실패했습니다.`);
            } 
            
            if (result.data && typeof result.data.favored === 'boolean') {
                setFavored(result.data.favored);
            }

        } catch (err) {
            setFavored(originalFavored); 
            alert(err.message);
            console.error("Favorite API error:", err);
        }
    };

    const userRole = user?.role;
    
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
                            <img
                                src={favored ? fullStar : emptyStar}
                                alt={favored ? "찜하기 취소" : "찜하기"}
                                className="w-7 h-7"
                            />
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
                <p><strong>기간:</strong> {festivalInfo.period.begin ? new Date(festivalInfo.period.begin).toLocaleDateString() : '정보 없음'} ~ {festivalInfo.period.end ? new Date(festivalInfo.period.end).toLocaleDateString() : '정보 없음'}</p>
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

            <div className="flex flex-col md:flex-row gap-4 mt-4">
                {festivalData.companyRecruitStatus === "RECRUITING" && (
                    <RecruitCard
                        type="company"
                        recruitInfo={festivalData.companyRecruitDto}
                        festivalId={id}
                        applyStatus={userRole === "업체" ? festivalData.festivalOnlyDto.applyStatus : "NOT_APPLIED"}
                        userRole={userRole}
                    />
                )}
                {festivalData.laborRecruitStatus === "RECRUITING" && (
                    <RecruitCard
                        type="worker"
                        recruitInfo={festivalData.laborRecruitDto}
                        festivalId={id}
                        applyStatus={userRole === "단기근로자" ? festivalData.festivalOnlyDto.applyStatus : "NOT_APPLIED"}
                        userRole={userRole}
                    />
                )}
            </div>

            {isEnded && <FestivalReview festivalId={id}/>}
            
<section>
    <h2 className="text-2xl font-semibold mb-4">이런 업체는 어떠세요?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedCompanies.map((company) => (
            <CompanyCard 
                key={company.id} 
                company={{
                    companyId: company.id,
                    companyName: company.name,
                    companyCategory: company.category,
                    companyCity: company.address.city,
                    imageUrl: company.imageUrl,
                    favored: false // 추천 목록이므로 찜 상태는 false로 가정
                }} 
            />
        ))}
    </div>
</section>
        </div>
    );
}
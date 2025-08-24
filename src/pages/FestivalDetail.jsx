import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { companies } from "../data/recommendedCompanies.js";
import CompanyCard from "../components/CompanyCard";
import FestivalReview from "../components/FestivalReview";
import Navbar from "../components/Navbar.jsx";
import fullStar from '../assets/full_star.png';
import emptyStar from '../assets/empty_star.png';
import { AuthContext } from "../context/AuthContext.jsx";

function RecruitCard({ type, recruitInfo, festivalId, applyStatus }) {
    const navigate = useNavigate();
    if (!recruitInfo) return null;

    const today = new Date();
    const endDate = new Date(recruitInfo.period.end);
    const isRecruiting = today <= endDate;

    const hasApplied = applyStatus === "APPLIED";
    const applicationId = hasApplied ? recruitInfo.applicationId : null ;

    const handleButtonClick = () => {
        if (hasApplied && applicationId) {
            // ✅ applicationId가 있으면 지원서 조회 페이지로 이동
            const resultPageType = type === 'company' ? 'company' : 'worker';
            navigate(`/application/result/${applicationId}?type=${resultPageType}`);
        } else {
            // ✅ applicationId가 없으면 기존처럼 지원 페이지로 이동
            navigate(`/recruit/${type}/${festivalId}`);
        }
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
            <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4 w-full hover:bg-blue-600 transition-colors" 
                onClick={handleButtonClick}
            >
                {hasApplied ? "지원서 조회하기" : "공고 확인 및 지원하기"}
            </button>
        </div>
    );
}

export default function FestivalDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${id}`, {
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

    const toggleFavorite = async () => {
        console.log("찜하기 클릭! 현재 URL의 id:", id); 
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
    }

    // 1. 현재 찜(favored) 상태에 따라 요청 메서드와 메시지를 결정합니다.
    //    - 이미 찜한 상태(true)이면 => 취소(DELETE) 요청
    //    - 찜하지 않은 상태(false)이면 => 추가(PUT) 요청
    const originalFavored = favored;
    setFavored(!originalFavored);
    
    const method = !originalFavored ? "PUT" : "DELETE";
    const actionMessage = !originalFavored ? "찜" : "찜 취소";

    // 2. API에 보낼 요청 본문(request body)을 만듭니다.
    //    이 페이지는 축제 상세 페이지이므로 receiveType은 "FESTIVAL" 입니다.
    const requestBody = {
        receiverId: parseInt(id), // URL 파라미터 id를 숫자로 변환
        receiverType: "FESTIVAL"
    };

    // ✅ 요청이 제대로 전달되는지 확인하기 위한 콘솔 출력
    console.log(`${actionMessage} 요청 Body:`, JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
            method: method, // 결정된 메서드 사용
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
        // 2. 에러 발생 시, UI 상태를 원래대로 되돌립니다.
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

            <div className="flex flex-col md:flex-row gap-4 mt-4">
    {festivalData.companyRecruitStatus === "RECRUITING" && (
        <RecruitCard 
            type="company" 
            recruitInfo={festivalData.companyRecruitDto} 
            festivalId={id} 
            // ✅ companyRecruitDto에서 applicationId를 prop으로 전달
            applyStatus={userRole === '업체' ? festivalData.festivalOnlyDto.applyStatus : "NOT_APPLIED"} 
        />
    )}
    {festivalData.laborRecruitStatus === "RECRUITING" && (
        <RecruitCard 
            type="worker" 
            recruitInfo={festivalData.laborRecruitDto} 
            festivalId={id} 
            // ✅ laborRecruitDto에서 applicationId를 prop으로 전달
            applyStatus={userRole === '단기근로자' ? festivalData.festivalOnlyDto.applyStatus : "NOT_APPLIED"}
        />
    )}
</div>

            {isEnded && <FestivalReview festivalId={id}/>}
            
            <section>
                <h2 className="text-2xl font-semibold mb-4">이런 업체는 어떠세요?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {/* 추천 업체 목록 API 연동 필요 */}
                </div>
            </section>
        </div>
    );
}

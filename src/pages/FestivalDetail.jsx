import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import CompanyCard from "../components/CompanyCard";
import FestivalReview from "../components/FestivalReview";
import Navbar from "../components/Navbar.jsx";
import fullStar from '../assets/full_star.png';
import emptyStar from '../assets/empty_star.png';
import { AuthContext } from "../context/AuthContext.jsx";
import Box from "../components/Box.jsx";
import "../styles/FestivalDetail.css";

function RecruitCard({ type, recruitInfo, festivalId, applyStatus, userRole }) {

  console.log(`[${type} 카드] 가 받은 applyStatus:`, applyStatus);

  
    const navigate = useNavigate();
    if (!recruitInfo) return null;

    const today = new Date();
    const endDate = new Date(recruitInfo.period.end);
    const isRecruiting = today <= endDate;
    const hasApplied = applyStatus === "APPLIED";

    let canApply = true;
    if (userRole === "축제기획자") canApply = false;
    else if (userRole === "업체" && type === "worker") canApply = false;
    else if (userRole === "단기근로자" && type === "company") canApply = false;

    const isDisabled = hasApplied || !canApply || !isRecruiting;
    const handleButtonClick = () => {
        if (!isDisabled) navigate(`/recruit/${type}/${festivalId}`);
    };

    return (
          <div className="recruit-card">
            <div className="recruitcard-info">
            <div className="recruit-card-header">
                <h3>{type === "company" ? "업체 모집" : "단기 근로자 모집"}</h3>
                <span className={`status-badge ${isRecruiting ? 'status-ongoing' : 'status-ended'}`}>
                    {isRecruiting ? "모집 중" : "모집 완료"}
                </span>
            </div>
            <p className="recruit-period">
                모집 기간: {new Date(recruitInfo.period.begin).toLocaleDateString()} ~ {new Date(recruitInfo.period.end).toLocaleDateString()}
            </p>
            <p><strong>공지:</strong> {recruitInfo.notice}</p>
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
            </div>
            <button 
                className={`recruit-button ${isDisabled ? 'disabled' : 'active'}`} 
                onClick={handleButtonClick} 
                disabled={isDisabled}
            >
                {hasApplied ? "지원 완료" : !canApply ? "지원 불가" : !isRecruiting ? "모집 기간 종료" : "지원하기"}
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
            if (!accessToken) { setError("로그인이 필요합니다."); setLoading(false); return; }
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${id}`, {
                    method: 'GET', headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                if (result.success) {
                    setFestivalData(result.data);
                    setFavored(result.data.festivalOnlyDto.favorStatus === "FAVORED");
                } else throw new Error(result.message || "데이터를 불러오는 데 실패했습니다.");
                const recommendedResponse = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${id}/recommended-companies`, {
                    method: 'GET', headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                if (!recommendedResponse.ok) throw new Error(`HTTP error! status: ${recommendedResponse.status}`);
                const recommendedResult = await recommendedResponse.json();
                if (recommendedResult.success) setRecommendedCompanies(recommendedResult.data);
            } catch (err) { setError(err.message); } finally { setLoading(false); }
        };
        fetchFestivalDetail();
    }, [id]);

    if (loading) return <p className="center-text">로딩 중...</p>;
    if (error) return <p className="center-text error-text">에러: {error}</p>;
    if (!festivalData) return <p className="center-text">축제를 찾을 수 없습니다.</p>;

    const festivalInfo = festivalData.festivalOnlyDto;
    const today = new Date();
    const endDate = festivalInfo.period ? new Date(festivalInfo.period.end) : null;
    const beginDate = festivalInfo.period ? new Date(festivalInfo.period.begin) : null;
    const isOngoing = beginDate && endDate && today >= beginDate && today <= endDate;
    const diffDays = beginDate ? Math.ceil((beginDate.getTime() - today.getTime()) / (1000*60*60*24)) : null;
    let dDay = isOngoing ? "진행 중" : diffDays>0 ? `D-${diffDays}` : "행사 종료";
    const isEnded = endDate ? today > endDate : false;

    const toggleFavorite = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) { alert("로그인이 필요합니다."); return; }
        const originalFavored = favored;
        setFavored(!originalFavored);
        const method = !originalFavored ? "PUT" : "DELETE";
        const requestBody = { receiverId: parseInt(id), receiverType: "FESTIVAL" };
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
                method, headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(`${!originalFavored ? "찜" : "찜 취소"}에 실패했습니다.`);
            if (result.data && typeof result.data.favored === 'boolean') setFavored(result.data.favored);
        } catch (err) { setFavored(originalFavored); alert(err.message); }
    };

    const userRole = user?.role;

    return (
        <div className="content-wrapper">
  <Navbar />

  {/* 상단 이미지 + 정보 */}
  <section className="festival-header">
    <img
      src={festivalInfo.imageUrl || `https://placehold.co/208x277/e2e8f0/4a5568?text=${festivalInfo.name}`}
      alt={festivalInfo.name}
      className="festival-image"
    />
    <div className="festival-info-side">
      <div className="festival-title">
        <h1>{festivalInfo.name}</h1>
        <button onClick={toggleFavorite}>
          <img src={favored ? fullStar : emptyStar} alt={favored ? "찜 취소" : "찜하기"} />
        </button>
      </div>
      <div className="festival-status">
        <span className={`status-badge ${isOngoing ? 'status-ongoing' : 'status-upcoming'}`}>{isOngoing ? "진행 중" : "진행 예정/종료"}</span>
        <span className="status-dday">{dDay}</span>
      </div>
      <p className="festival-period">{festivalInfo.period.begin ? new Date(festivalInfo.period.begin).toLocaleDateString() : '정보 없음'} ~ {festivalInfo.period.end ? new Date(festivalInfo.period.end).toLocaleDateString() : '정보 없음'}</p>
      <div className="festival-icons">
        <span>📍 {festivalInfo.address.city} {festivalInfo.address.district}</span>
        <span>💰 {festivalInfo.fee}</span>
        <span>⏰ {festivalInfo.time}</span>
      </div>
    </div>
  </section>

  {/* 축제소개 / 공식사이트 / 기획자 정보 */}
  <section className="festival-info">
    <h2>축제소개</h2>
    <p>{festivalInfo.introduction}</p>

    <h2>공식사이트</h2>
    <a href={festivalInfo.link} target="_blank" rel="noreferrer">{festivalInfo.link}</a>

    <h2>기획자 정보</h2>
    <p>{festivalInfo.holderName}</p>
    <p>{festivalInfo.tel}</p>
  </section>

  {/* 참여자 모집 안내 */}
  <div className="recruit-announcement">
    행사운영을 함께할 참여자를 모집합니다
  </div>

  <div className="recruit-section">
  <div className="recruit-grid">
    {festivalData.companyRecruitStatus === "RECRUITING" && (
      <div className="recruit-card-wrapper">
        <RecruitCard
          type="company"
          recruitInfo={festivalData.companyRecruitDto}
          festivalId={id}
          applyStatus={userRole === "업체" ? festivalData.festivalOnlyDto.applyStatus : "NOT_APPLIED"}
          userRole={userRole}
        />
      </div>
    )}

    {festivalData.laborRecruitStatus === "RECRUITING" && (
      <div className="recruit-card-wrapper">
        <RecruitCard
          type="worker"
          recruitInfo={festivalData.laborRecruitDto}
          festivalId={id}
          applyStatus={userRole === "단기근로자" ? festivalData.festivalOnlyDto.applyStatus : "NOT_APPLIED"}
          userRole={userRole}
        />
      </div>
    )}
  </div>
</div>

 {/* 후기 */}
  {isEnded && <FestivalReview festivalId={id} />}


  {/* 추천 업체 카드 */}
  <section className="recommended-companies">
    <h2>이런 업체는 어떠세요?</h2>
    <div className="recommended-grid">
      {recommendedCompanies.slice(0, 6).map((company) => (
        <CompanyCard
          key={company.id}
          company={{
            companyId: company.id,
            companyName: company.name,
            companyCategory: company.category,
            companyCity: company.address.city,
            imageUrl: company.imageUrl,
            favored: false
          }}
          className="company-card"
        />
      ))}
    </div>
  </section>

</div>

    );
}

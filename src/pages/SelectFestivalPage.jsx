import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/SelectFestivalPage.css'; // 1. CSS 파일을 import 합니다.

// 날짜 형식을 'YYYY-MM-DD'로 간단하게 바꿔주는 함수
const formatDate = (dateString) => dateString.split('T')[0];

export default function SelectFestivalPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { companyId, companyName } = location.state || {};

    const [festivals, setFestivals] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyFestivals = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("로그인이 필요합니다.");
                setPageLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me/festivals?holdStatus=ONGOING&page=0&size=5`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                if (!response.ok) throw new Error("축제 목록을 불러오는 데 실패했습니다.");
                const result = await response.json();
                if (result.success) {
                    setFestivals(result.data.content);
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                setError(err.message || "오류가 발생했습니다.");
            } finally {
                setPageLoading(false);
            }
        };
        fetchMyFestivals();
    }, []);

    const handleSelectAndSend = async (selectedFestival) => {
        setActionLoadingId(selectedFestival.id);
        setError('');
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            setActionLoadingId(null);
            return;
        }
        const requestBody = { festivalId: selectedFestival.id };
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/${companyId}/interests`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            const result = await response.json();
            if (response.ok && result.success) {
                alert(`'${companyName}' 업체에 관심을 보냈습니다!`);
                navigate(`/company/${companyId}`);
            } else {
                throw new Error(result.message || '요청 처리에 실패했습니다.');
            }
        } catch (err) {
            if (err.message && err.message.includes("이미 관심을 보냈습니다")) {
                alert("이미 이 축제로 관심을 보냈습니다.");
            } else {
                setError(err.message);
            }
        } finally {
            setActionLoadingId(null);
        }
    };

    if (pageLoading) {
        return <div className="loading-message">축제 목록을 불러오는 중...</div>;
    }
    
    if (!companyId || !companyName) {
        return (
            <div className="info-message">
                <p>업체 정보가 올바르지 않습니다.</p>
                <button onClick={() => navigate(-1)}>이전 페이지로 돌아가기</button>
            </div>
        );
    }

    return (
        <div className="select-festival-page-container">
            <Navbar />
            <h1 className="page-title">관심 보낼 축제 선택하기</h1>
            <p className="page-subtitle">
                <strong>{companyName}</strong> 업체에 관심을 보낼 축제를 선택하세요.
            </p>

            <div className="festival-list-container-select">
                {festivals.map((festival) => {
                    const isLoading = actionLoadingId === festival.id;
                    return (
                        <div key={festival.id} className="festival-card">
                            <img 
                                src={festival.imageUrl || 'https://placehold.co/100x100/e2e8f0/4a5568?text=Fest'} 
                                alt={festival.name}
                                className="festival-image"
                            />
                            <div className="festival-info">
                                <h3>{festival.name}</h3>
                                <p className="address">{`${festival.address.city} ${festival.address.district}`}</p>
                                <p className="period">
                                    {`${formatDate(festival.period.begin)} ~ ${formatDate(festival.period.end)}`}
                                </p>
                            </div>
                            
                            <button
                                onClick={() => handleSelectAndSend(festival)}
                                disabled={actionLoadingId !== null}
                                className="select-button"
                            >
                                {isLoading ? '전송중...' : '선택'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {error && (
                <p className="error-message">{error}</p>
            )}
        </div>
    );
}
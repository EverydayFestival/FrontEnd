import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

    // ✅ 1. useEffect에서 목업 데이터 대신 실제 API를 호출합니다.
    useEffect(() => {
        const fetchMyFestivals = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("로그인이 필요합니다.");
                setPageLoading(false);
                return;
            }

            try {
                // 내가 등록한 축제 목록 API 호출 (GET)
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

    // ✅ 2. handleSelectAndSend 함수에 '관심 보내기' API 연동 로직을 추가합니다.
    const handleSelectAndSend = async (selectedFestival) => {
        setActionLoadingId(selectedFestival.id);
        setError('');

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            setActionLoadingId(null);
            return;
        }

        const requestBody = {
            festivalId: selectedFestival.id
        };
        
        console.log("관심 보내기 요청 Body:", JSON.stringify(requestBody, null, 2));

        try {
            // 관심 보내기 API 호출 (POST)
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
                // ✅ 3. 성공 시 alert를 띄우고 업체 상세 페이지로 돌아갑니다.
                alert(`'${companyName}' 업체에 관심을 보냈습니다!`);
                navigate(`/company/${companyId}`);
            } else {
                throw new Error(result.message || '요청 처리에 실패했습니다.');
            }
        } catch (err) {
            // ✅ 임시 방편: 에러 메시지 텍스트로 중복 에러를 구분합니다.
            // 백엔드에서 보낸 에러 메시지에 "이미 관심을 보냈습니다."가 포함되어 있는지 확인
            if (err.message && err.message.includes("이미 관심을 보냈습니다")) {
                alert("이미 이 축제로 관심을 보냈습니다.");
            } else {
                // 그 외 다른 500 에러는 기존처럼 하단에 표시
                setError(err.message);
            }
        } finally {
            setActionLoadingId(null);
        }
    };

    if (pageLoading) {
        return <div className="text-center mt-20">축제 목록을 불러오는 중...</div>;
    }
    
    if (!companyId || !companyName) {
        return (
            <div className="text-center mt-20">
                <p>업체 정보가 올바르지 않습니다.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-600">이전 페이지로 돌아가기</button>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <Navbar />
            <h1 className="text-3xl font-bold text-center mb-2">관심 보낼 축제 선택하기</h1>
            <p className="text-lg text-gray-600 text-center mb-8">
                <strong className="text-blue-600">{companyName}</strong> 업체에 관심을 보낼 축제를 선택하세요.
            </p>

            <div className="space-y-4">
                {festivals.map((festival) => {
                    const isLoading = actionLoadingId === festival.id;
                    return (
                        <div key={festival.id} className="w-full text-left p-4 border rounded-lg bg-white shadow-sm flex items-center gap-4">
                            <img 
                                src={festival.imageUrl || 'https://placehold.co/100x100/e2e8f0/4a5568?text=Fest'} 
                                alt={festival.name}
                                className="w-24 h-24 rounded-md object-cover bg-gray-200"
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800">{festival.name}</h3>
                                <p className="text-md text-gray-500">{`${festival.address.city} ${festival.address.district}`}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {`${formatDate(festival.period.begin)} ~ ${formatDate(festival.period.end)}`}
                                </p>
                            </div>
                            
                            <button
                                onClick={() => handleSelectAndSend(festival)}
                                disabled={actionLoadingId !== null} // 어떤 요청이든 진행 중이면 모든 버튼 비활성화
                                className="font-bold py-2 px-5 rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? '전송중...' : '선택'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {error && (
                <p className="mt-6 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
            )}
        </div>
    );
}
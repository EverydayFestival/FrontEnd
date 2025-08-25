import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import '../styles/RecruitCompanyResult.css'

export default function RecruitCompanyResult() {
    const { applicationId } = useParams(); // URL에서 applicationId를 가져옴
    const navigate = useNavigate();
    
    // ✅ API 응답 데이터를 저장할 state
    const [applicationData, setApplicationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ useEffect에서 실제 API를 호출하여 지원서 내용을 가져옴
    useEffect(() => {
        const fetchApplication = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) { /* ... 로그인 필요 처리 ... */ }

            try {
                // 지원서 조회 API 호출 (GET)
                const response = await fetch(`${import.meta.env.VITE_API_URL}/applications/${applicationId}`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                if (!response.ok) throw new Error("지원서 정보를 불러오는 데 실패했습니다.");

                const result = await response.json();
                if (result.success) {
                    setApplicationData(result.data);
                    console.log(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [applicationId]);

    if (loading) return <p className="text-center mt-8">지원서 정보를 불러오는 중...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">에러: {error}</p>;
    if (!applicationData) return <p className="text-center mt-8">지원서 정보를 찾을 수 없습니다.</p>;

    // ✅ API에서 받은 데이터를 화면에 렌더링
    const { answers, extraQuestions, extraAnswers } = applicationData;
    const fixedQuestionLabels = ["업체 전화번호", "이메일", "가능한 날짜와 시간", "참여 분야"];

    return (
        <div>
            <Navbar />
            <div className="PageBackground">
                <button 
                    onClick={() => navigate(-1)} // 이전 페이지(축제 상세)로 돌아가기
                    className="BackButton"
                >돌아가기</button>
            <div className="ViewPageWrapper">

                <h1 className="ViewAppliTitle">제출한 지원서 확인</h1>

                <div className="ApplicationWrapper">
                    {/* 고정 질문과 답변 렌더링 */}
                    {answers.map((answer, index) => (
                        <div key={index}>
                            <label className="block font-semibold text-gray-700">{fixedQuestionLabels[index]}</label>
                            <p className="mt-1">{answer}</p>
                        </div>
                    ))}

                    {/* 추가 질문과 답변 렌더링 */}
                    {extraQuestions && extraQuestions.length > 0 && (
                        <div className="Extras">
                            {extraQuestions.map((question, index) => (
                                <div key={index} className="mt-4">
                                    <label className="block font-semibold text-gray-700">{question}</label>
                                    <p className="mt-1">{extraAnswers[index]}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


            </div>
        </div>
        </div>
    );
}
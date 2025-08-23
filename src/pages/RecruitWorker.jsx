import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFestivalById } from "../assets/fest/festivals";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function RecruitWorker() {
    const { id } = useParams(); // URL에서 축제 ID를 가져옵니다.
    const navigate = useNavigate();
    
    // API 응답 전체를 저장할 state
    const [festivalData, setFestivalData] = useState(null);
    // 사용자의 답변을 저장할 state
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecruitmentData = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                // 1. 축제 상세 정보 API를 호출하여 모집 공고 데이터를 가져옵니다.
                const response = await fetch(`/api/festivals/${id}`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    // 2. 근로자 모집 중이 아니면 경고창을 띄우고 이전 페이지로 돌려보냅니다.
                    if (result.data.laborRecruitStatus !== "RECRUITING" || !result.data.laborRecruitDto) {
                        alert("현재 단기 근로자를 모집하고 있지 않습니다.");
                        navigate(`/festivals/${id}`);
                        return;
                    }
                    setFestivalData(result.data);
                } else {
                    throw new Error(result.message || "데이터를 불러오는 데 실패했습니다.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecruitmentData();
    }, [id, navigate]);

    // 로딩 및 에러 상태 처리
    if (loading) return <p className="text-center mt-8">로딩 중...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">에러: {error}</p>;
    if (!festivalData) return <p className="text-center mt-8">축제 정보를 찾을 수 없습니다.</p>;

    // API 데이터 구조에 맞게 변수 할당
    const festivalInfo = festivalData.festivalOnlyDto;
    const laborRecruitInfo = festivalData.laborRecruitDto;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers((prev) => ({ ...prev, [name]: value }));
    };
    
    // 추가 질문에 대한 답변을 처리하는 핸들러
    const handleExtraQuestionChange = (index, value) => {
        setAnswers(prev => ({
            ...prev,
            extraAnswers: {
                ...prev.extraAnswers,
                [index]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 여기에 지원서 제출(POST) API 호출 로직을 추가하면 됩니다.
        // 예시: const response = await fetch(`/api/recruits/${laborRecruitInfo.id}/apply`, { ... });
        
        console.log("제출할 답변:", answers);
        alert("지원서가 성공적으로 제출되었습니다!");
        navigate(`/festivals/${id}`);
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-2">{festivalInfo.name}</h1>
                <h2 className="text-xl font-semibold mb-6 text-gray-700">단기 근로자 모집</h2>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <p className="text-sm">안녕하세요. <strong>{festivalInfo.holderName}</strong>에서 주최하는 <strong>{festivalInfo.name}</strong> 행사에 참여할 단기 근로자를 모집하고 있습니다.</p>
                    {laborRecruitInfo.notice && <p className="mt-2 text-sm"><strong>안내사항:</strong> {laborRecruitInfo.notice}</p>}
                </div>
                <p className="mb-4 text-sm text-red-500">*은 필수입력란입니다.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 기본 질문 */}
                    <div><label className="block font-semibold">이름 *</label><input type="text" name="workerName" onChange={handleChange} className="border p-2 w-full rounded" required /></div>
                    <div>
                        <label className="block font-semibold">성별 *</label>
                        <select name="gender" onChange={handleChange} className="border p-2 w-full rounded" required defaultValue="">
                            <option value="" disabled>선택</option>
                            <option value="남">남</option>
                            <option value="여">여</option>
                        </select>
                    </div>
                    <div><label className="block font-semibold">나이 *</label><input type="number" name="workerAge" onChange={handleChange} className="border p-2 w-full rounded" required /></div>
                    <div><label className="block font-semibold">전화번호 *</label><input type="tel" name="workerPhone" onChange={handleChange} className="border p-2 w-full rounded" required /></div>
                    <div><label className="block font-semibold">이메일 *</label><input type="email" name="workerEmail" onChange={handleChange} className="border p-2 w-full rounded" required /></div>
                    
                    {/* API에서 받아온 추가 질문들을 동적으로 렌더링 */}
                    {laborRecruitInfo.extraQuestions && laborRecruitInfo.extraQuestions.map((question, index) => (
                        <div key={index}>
                            <label className="block font-semibold">{question} *</label>
                            <input
                                type="text"
                                name={`extraQuestion_${index}`}
                                onChange={(e) => handleExtraQuestionChange(index, e.target.value)}
                                className="border p-2 w-full rounded"
                                required
                            />
                        </div>
                    ))}

                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">제출하기</button>
                </form>
            </div>
        </div>
    );
}
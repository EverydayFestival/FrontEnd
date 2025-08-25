import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RecruitWorker() {
    const { id } = useParams(); // URL에서 축제 ID를 가져옵니다.
    const navigate = useNavigate();
    
    // API 응답 전체를 저장할 state
    const [festivalData, setFestivalData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [additionalQuestions, setAdditionalQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecruitmentData = async () => {
            setLoading(true);
            setError(null);
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                // ✅ 2. API 호출 주소를 Vite 프록시를 사용하도록 '/api'로 수정합니다.
                const festivalResponse = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${id}`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                if (!festivalResponse.ok) {
                    throw new Error(`HTTP error! status: ${festivalResponse.status}`);
                }

                const result = await festivalResponse.json();
                if (result.success) {
                    const festival = result.data;
                    if (festival.laborRecruitStatus !== "RECRUITING" || !festival.laborRecruitDto) {
                        alert("현재 단기 근로자를 모집하고 있지 않습니다.");
                        navigate(`/festivals/${id}`);
                        return;
                    }
                    setFestivalData(festival);

                    // ✅ 3. 축제 정보에서 recruitId를 가져와 추가 질문 API를 호출합니다.
                    const recruitId = festival.laborRecruitDto.id; // recruitId 추출 (가정)
                    if (recruitId) {
                        const questionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/recruits/${recruitId}`, {
                            headers: { 'Authorization': `Bearer ${accessToken}` }
                        });
                        if (!questionsResponse.ok) throw new Error("추가 질문을 불러오는 데 실패했습니다.");

                        const questionsResult = await questionsResponse.json();
                        setAdditionalQuestions(questionsResult.data.questions);
                    }
                } else {
                    throw new Error(result.message || "데이터를 불러오는 데 실패했습니다.");
                }
            } catch (err) {
                setError(err.message);
                alert(err.message || "데이터 로딩 중 오류 발생");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchRecruitmentData();
    }, [id, navigate]);

    if (loading) return <p className="text-center mt-8">로딩 중...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">에러: {error}</p>;
    if (!festivalData) return <p className="text-center mt-8">축제 정보를 찾을 수 없습니다.</p>;

    const festivalInfo = festivalData.festivalOnlyDto;
    const laborRecruitInfo = festivalData.laborRecruitDto;

    // ✅ 4. 모든 입력 필드를 하나의 핸들러로 처리합니다.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
    }

    // 1. API가 요구하는 형식으로 답변 데이터를 재구성합니다.
    
    // 고정 질문 키 (서버가 요구하는 순서대로)
    const fixedQuestionKeys = [
        'workerName', 
        'gender', 
        'workerAge', 
        'workerPhone', 
        'workerEmail'
    ];

    const fixedAnswers = fixedQuestionKeys.map(key => answers[key] || "");

    // 추가 질문 답변 (extraQuestion_으로 시작하는 키)
    const extraAnswers = Object.keys(answers)
        .filter(key => key.startsWith('extraQuestion_'))
        .sort() // 질문 순서를 보장하기 위해 정렬
        .map(key => answers[key]);

    const requestBody = {
        answers: fixedAnswers,
        extraAnswers: extraAnswers
    };

    // ✅ 요청이 제대로 전달되는지 확인하기 위한 콘솔 출력
    console.log("API 요청 Body:", JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${id}/labor-applications`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert("지원서가 성공적으로 제출되었습니다!");
            console.log("✅ 지원서 제출 성공! 서버 응답 데이터:", result.data);
            navigate(`/festivals/${id}`); // 제출 후 축제 상세 페이지로 이동
        } else {
            // 서버에서 보낸 에러 메시지를 보여줍니다.
            alert(result.message || "제출에 실패했습니다.");
        }

    } catch (err) {
        console.error("Submit API error:", err);
        alert("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
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
                    {additionalQuestions.length > 0 && (
                        <div className="border-t pt-6 mt-6">
                           <h3 className="text-lg font-semibold mb-4">추가 질문</h3>
                           {additionalQuestions.map((question, index) => (
                               <div key={index}>
                                   <label className="block font-semibold">{question} *</label>
                                   <input
                                       type="text"
                                       name={`extraQuestion_${index}`} // 고유한 name 부여
                                       onChange={handleChange} // 통일된 핸들러 사용
                                       className="border p-2 w-full rounded"
                                       required
                                   />
                               </div>
                           ))}
                        </div>
                    )}

                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">제출하기</button>
                </form>
            </div>
        </div>
    );
}
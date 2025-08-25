import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
// CSS 파일을 import 합니다.
import "../styles/RecruitWorker.css";

export default function RecruitWorker() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [festivalData, setFestivalData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [additionalQuestions, setAdditionalQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ... (데이터 로딩 및 제출 로직은 그대로 유지) ...
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

                    const recruitId = festival.laborRecruitDto.id;
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

        const fixedQuestionKeys = ['workerName', 'gender', 'workerAge', 'workerPhone', 'workerEmail'];
        const fixedAnswers = fixedQuestionKeys.map(key => answers[key] || "");
        const extraAnswers = Object.keys(answers)
            .filter(key => key.startsWith('extraQuestion_'))
            .sort()
            .map(key => answers[key]);

        const requestBody = {
            answers: fixedAnswers,
            extraAnswers: extraAnswers
        };

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
                navigate(`/festivals/${id}`);
            } else {
                alert(result.message || "제출에 실패했습니다.");
            }
        } catch (err) {
            console.error("Submit API error:", err);
            alert("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

    if (loading) return <div className="loading-container"><p>로딩 중...</p></div>;
    if (error) return <div className="loading-container"><p className="error-text">에러: {error}</p></div>;
    if (!festivalData) return <div className="loading-container"><p>축제 정보를 찾을 수 없습니다.</p></div>;

    const festivalInfo = festivalData.festivalOnlyDto;
    const laborRecruitInfo = festivalData.laborRecruitDto;

    return (
        <div className="recruit-page-container">
            <Navbar />
            <div className="form-container">
                <div className="form-header">
                    <h1>{festivalInfo.name}</h1>
                    <h2>단기 근로자 모집</h2>
                </div>
                
                <div className="info-box">
                    <p>안녕하세요. <strong>{festivalInfo.holderName}</strong>에서 주최하는 <strong>{festivalInfo.name}</strong> 행사에 참여할 단기 근로자를 모집하고 있습니다.</p>
                    {laborRecruitInfo.notice && <p><strong>안내사항:</strong> {laborRecruitInfo.notice}</p>}
                </div>
                <p className="required-notice">*은 필수입력란입니다.</p>

                <form onSubmit={handleSubmit}>
                    <fieldset className="form-section">
                        <legend>기본 질문</legend>
                        <div className="form-group">
                            <label htmlFor="workerName">이름 *</label>
                            <input type="text" id="workerName" name="workerName" onChange={handleChange} className="form-input" required />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="gender">성별 *</label>
                            <select id="gender" name="gender" onChange={handleChange} className="form-select" required defaultValue="">
                                <option value="" disabled>선택</option>
                                <option value="남">남</option>
                                <option value="여">여</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="workerAge">나이 *</label>
                            <input type="number" id="workerAge" name="workerAge" onChange={handleChange} className="form-input" required />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="workerPhone">전화번호 *</label>
                            <input type="tel" id="workerPhone" name="workerPhone" onChange={handleChange} className="form-input" required />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="workerEmail">이메일 *</label>
                            <input type="email" id="workerEmail" name="workerEmail" onChange={handleChange} className="form-input" required />
                        </div>
                    </fieldset>
                    
                    {additionalQuestions.length > 0 && (
                        <fieldset className="form-section">
                            <legend>추가 질문</legend>
                            {additionalQuestions.map((question, index) => (
                                <div className="form-group" key={index}>
                                    <label htmlFor={`extraQuestion_${index}`}>{question} *</label>
                                    <input
                                        type="text"
                                        id={`extraQuestion_${index}`}
                                        name={`extraQuestion_${index}`}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            ))}
                        </fieldset>
                    )}

                    <button type="submit" className="submit-button">제출하기</button>
                </form>
            </div>
        </div>
    );
}
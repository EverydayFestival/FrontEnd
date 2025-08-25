import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import '../styles/RecruitCompany.css'
import Box from "../components/Box";

export default function RecruitCompany() {
  const { id } = useParams();
  const navigate = useNavigate();
  // festival state에는 이제 API 응답의 'data' 객체가 저장됩니다.
  const [festivalData, setFestivalData] = useState(null);
  const [answers, setAnswers] = useState({});

  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
        const fetchRecruitData = async () => {
            setLoading(true);
            setError(null);
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                // 1. 축제 정보 API 호출
                const festivalResponse = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${id}`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                if (!festivalResponse.ok) throw new Error("축제 정보를 불러오는 데 실패했습니다.");
                
                const festivalResult = await festivalResponse.json();
                const festival = festivalResult.data;

                if (festival.companyRecruitStatus !== "RECRUITING" || !festival.companyRecruitDto) {
                    alert("현재 업체를 모집하고 있지 않습니다.");
                    navigate(`/festivals/${id}`);
                    return;
                }
                setFestivalData(festival);

                // 2. 추가 질문 API 호출
                const recruitId = festival.companyRecruitDto.id;
                if (recruitId) {
                    const questionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/recruits/${recruitId}`, {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    if (!questionsResponse.ok) throw new Error("추가 질문을 불러오는 데 실패했습니다.");

                    const questionsResult = await questionsResponse.json();
                    setAdditionalQuestions(questionsResult.data.questions);
                }

            } catch (err) {
                setError(err.message);
                // 사용자에게 에러를 알리고 이전 페이지로 보낼 수 있습니다.
                alert(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
                navigate(-1); // 이전 페이지로 이동
            } finally {
                setLoading(false);
            }
        };

        fetchRecruitData();
    }, [id, navigate]);
    
    // 로딩 및 데이터 유효성 검사
    if (loading) return <p className="text-center mt-8">모집 정보를 불러오는 중...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">에러: {error}</p>;
    if (!festivalData) return null; // 데이터가 없으면 렌더링하지 않음

    const festivalInfo = festivalData.festivalOnlyDto;
    const companyRecruitInfo = festivalData.companyRecruitDto;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAnswers((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
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
        'companyPhone', 
        'companyEmail', 
        'availableTime', 
        'category'
    ];

    const fixedAnswers = fixedQuestionKeys.map(key => answers[key] || "");

    // 추가 질문 답변 (additional_question_으로 시작하는 키)
    const extraAnswers = Object.keys(answers)
        .filter(key => key.startsWith('additional_question_'))
        .sort() // 질문 순서를 보장하기 위해 정렬
        .map(key => answers[key]);

    const requestBody = {
        answers: fixedAnswers,
        extraAnswers: extraAnswers
    };

    // ✅ 요청이 제대로 전달되는지 확인하기 위한 콘솔 출력
    console.log("API 요청 Body:", JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${id}/company-applications`, {
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
      <div className="PageBackground">
      <div className="PageWrapper">
        <h1 className="FestName">
          {festivalInfo.name}
        </h1>
        <h2 className="RecruitTitle">업체 참여자 모집</h2>
        
        <div className="Information">
            <p className="Hello">
                안녕하세요. <strong>{festivalInfo.holderName}</strong>에서 주최하는 <strong>{festivalInfo.name}</strong> 행사에 참여할 업체를 모집하고 있습니다.
            </p>
            {companyRecruitInfo.notice && <p className="mt-2 text-sm"><strong>안내사항:</strong> {companyRecruitInfo.notice}</p>}
        </div>
        <p className="Mandatory">*은 필수입력란입니다.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <label className="CoTel">업체 전화번호 *</label>
            <input
              type="tel"
              name="companyPhone"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="CoEmail">이메일 *</label>
            <input
              type="email"
              name="companyEmail"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="CoTimeDate">가능한 날짜와 시간 *</label>
            <input
              type="text"
              name="availableTime"
              placeholder="예시) 9/12 9:00 ~ 18:00, 9/13 13:00 ~ 18:00"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          {/* [수정] companyRecruitDto의 categories를 사용합니다. */}
          {companyRecruitInfo?.categories?.length > 0 && (
                        <div className="ChooseType">
                            <label className="block font-semibold">
                                참여 분야 선택 (하나만 선택) *
                            </label>
                            <div className="ChooseTypeBtn">
                                {companyRecruitInfo.categories.map((cat) => (
                                    <label key={cat} className="flex items-center gap-2">
                                        {/* ✅ 1. type을 "radio"로 변경 */}
                                        <input
                                            type="radio"
                                            // ✅ 2. 모든 라디오 버튼이 같은 name을 공유해야 하나만 선택됩니다.
                                            name="category" 
                                            // ✅ 3. value에 실제 값(cat)을 넣어줍니다.
                                            value={cat}
                                            onChange={handleChange}
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ✅ 4. 추가 질문 섹션을 map 루프 바깥으로 이동 */}
                    {additionalQuestions.length > 0 && (
                        <div className="AddQ">
                            <h3 className="AddQTitle">추가 질문</h3>
                            {additionalQuestions.map((question, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block font-semibold">
                                        {question} {question.includes('*') ? '' : '*'}
                                    </label>
                                    <input
                                        type="text"
                                        name={`additional_question_${index}`}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded"
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        지원하기
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
}
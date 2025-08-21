import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFestivalById } from "../data/festivals";
import Header from "../components/Header";

export default function RecruitWorker() {
  const { id } = useParams();
  const navigate = useNavigate();
  // festivalData state에는 이제 API 응답의 'data' 객체가 저장됩니다.
  const [festivalData, setFestivalData] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const foundFestival = getFestivalById(id);
    if (foundFestival && foundFestival.success) {
      // 근로자 모집 정보가 없으면 이 페이지에 접근할 수 없습니다.
      if (foundFestival.data.laborRecruitStatus !== "RECRUITING" || !foundFestival.data.laborRecruitDto) {
        alert("현재 단기 근로자를 모집하고 있지 않습니다.");
        navigate(`/festivals/${id}`);
        return;
      }
      setFestivalData(foundFestival.data);
    } else {
      alert("해당 축제를 찾을 수 없습니다.");
      navigate("/");
    }
  }, [id, navigate]);

  if (!festivalData) return <p className="text-center mt-8">Loading...</p>;

  // [수정] 새로운 데이터 구조에 맞게 변수를 선언합니다.
  const festivalInfo = festivalData.festivalOnlyDto;
  const laborRecruitInfo = festivalData.laborRecruitDto;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted answers:", answers);
    // localStorage 키를 더 명확하게 변경합니다.
    localStorage.setItem(`worker_answers_${id}`, JSON.stringify(answers));
    alert("지원서가 제출되었습니다!");
    // 지원서 조회 페이지 대신 상세 페이지로 이동하는 것이 일반적입니다.
    navigate(`/festivals/${id}`);
  };

  const ages = ["10대", "20대", "30대", "40대", "50대 이상"];

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-2">{festivalInfo.name}</h1>
        <h2 className="text-xl font-semibold mb-6 text-gray-700">단기 근로자 모집</h2>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-sm">
                안녕하세요. <strong>{festivalInfo.holderName}</strong>에서 주최하는 <strong>{festivalInfo.name}</strong> 행사에 참여할 단기 근로자를 모집하고 있습니다.
            </p>
            {laborRecruitInfo.notice && <p className="mt-2 text-sm"><strong>안내사항:</strong> {laborRecruitInfo.notice}</p>}
        </div>
        <p className="mb-4 text-sm text-red-500">*은 필수입력란입니다.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 질문 */}
          <div>
            <label className="block font-semibold">이름 *</label>
            <input
              type="text"
              name="workerName"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">성별 *</label>
            <select
              name="gender"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">나이 *</label>
            <select
              name="age"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">선택</option>
              {ages.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">전화번호 *</label>
            <input
              type="tel"
              name="workerPhone"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">이메일 *</label>
            <input
              type="email"
              name="workerEmail"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">
              가능한 날짜와 시간 *
            </label>
            <input
              type="text"
              name="availableTime"
              placeholder="예시) 9/12 9:00 ~ 18:00, 9/13 13:00 ~ 18:00"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          {/* [참고] 현재 API 데이터 구조에는 기획자가 직접 추가하는 질문(questions) 필드가 없습니다.
              만약 이 기능이 필요하다면, FestivalRegister에서 생성하고 festivals.js에 저장하는 로직이 필요합니다.
          */}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFestivalById } from "../data/festivals";
import Header from "../components/Header";

export default function RecruitCompanyResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [festivalData, setFestivalData] = useState(null);
  const [answers, setAnswers] = useState(null);

  useEffect(() => {
    const foundFestival = getFestivalById(id);
    if (foundFestival && foundFestival.success) {
      setFestivalData(foundFestival.data);
    } else {
      alert("해당 축제를 찾을 수 없습니다.");
      navigate("/");
    }

    // [수정] RecruitCompany.jsx에서 저장한 key와 일치시킵니다.
    const savedAnswers = localStorage.getItem(`company_answers_${id}`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [id, navigate]);

  if (!festivalData || !answers) return <p className="text-center mt-8">Loading...</p>;

  // [수정] 새로운 데이터 구조에 맞게 변수를 선언합니다.
  const festivalInfo = festivalData.festivalOnlyDto;
  const companyRecruitInfo = festivalData.companyRecruitDto;

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-2">제출한 지원서 확인</h1>
        <p className="mb-6 text-gray-600">
          <strong>{festivalInfo.holderName}</strong>의 <strong>{festivalInfo.name}</strong> 참가 지원서입니다.
        </p>

        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <div>
            <label className="block font-semibold text-gray-700">업체명</label>
            <p className="mt-1">{answers.companyName}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">업체 전화번호</label>
            <p className="mt-1">{answers.companyPhone}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">이메일</label>
            <p className="mt-1">{answers.companyEmail}</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">가능한 날짜와 시간</label>
            <p className="mt-1">{answers.availableTime}</p>
          </div>

          {/* [수정] companyRecruitInfo의 categories를 기반으로 선택된 분야를 표시합니다. */}
          {companyRecruitInfo?.categories?.length > 0 && (
            <div>
              <label className="block font-semibold text-gray-700">참여 분야</label>
              <ul className="list-disc ml-6 mt-1">
                {companyRecruitInfo.categories.map((cat) =>
                  answers[`field_${cat}`] ? <li key={cat}>{cat}</li> : null
                )}
              </ul>
            </div>
          )}

          {/* [참고] 기획자 질문에 대한 답변을 표시하는 로직 (필요 시 추가) */}
        </div>

        <button
          onClick={() => navigate(`/festivals/${id}`)}
          className="mt-6 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          축제 상세 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

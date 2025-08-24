import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFestivalById } from "../assets/fest/festivals";
import Header from "../components/Header";

export default function RecruitWorkerResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [festivalData, setFestivalData] = useState(null);
  const [answers, setAnswers] = useState(null);

  useEffect(() => {
    // 1. 축제 데이터 가져오기
    const foundFestival = getFestivalById(id);
    if (foundFestival && foundFestival.success) {
      setFestivalData(foundFestival.data);
    } else {
      alert("해당 축제를 찾을 수 없습니다.");
      navigate("/");
    }

    // 2. 지원서 API 호출
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // 토큰 가져오기
        const res = await fetch(`https://your-api.com/applications/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("지원서 조회 실패");
        }

        const data = await res.json();

        if (data.success) {
          // 배열 형태의 answers, extraAnswers를 기존 JSX 구조에 맞는 객체로 변환
          const mappedAnswers = {
            workerName: data.data.answers[0] || "",
            gender: data.data.answers[1] || "",
            age: data.data.answers[2] || "",
            workerPhone: data.data.answers[3] || "",
            workerEmail: data.data.answers[4] || "",
            availableTime: data.data.extraAnswers?.[1] || "",
          };

          setAnswers(mappedAnswers);
        } else {
          alert("지원서 조회에 실패했습니다.");
          navigate(`/festivals/${id}`);
        }
      } catch (err) {
        console.error(err);
        alert("지원서 조회 중 오류가 발생했습니다.");
        navigate(`/festivals/${id}`);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  if (!festivalData || !answers) return <p className="text-center mt-8">Loading...</p>;

  const festivalInfo = festivalData.festivalOnlyDto;

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-2">제출한 지원서 확인</h1>
        <p className="mb-6 text-gray-600">
          <strong>{festivalInfo.holderName}</strong>의 <strong>{festivalInfo.name}</strong> 단기 근로자 지원서입니다.
        </p>

        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <div>
            <label className="block font-semibold text-gray-700">이름</label>
            <p className="mt-1">{answers.workerName}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-700">성별</label>
            <p className="mt-1">{answers.gender}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-700">나이</label>
            <p className="mt-1">{answers.age}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-700">전화번호</label>
            <p className="mt-1">{answers.workerPhone}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-700">이메일</label>
            <p className="mt-1">{answers.workerEmail}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-700">가능한 날짜와 시간</label>
            <p className="mt-1">{answers.availableTime}</p>
          </div>
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

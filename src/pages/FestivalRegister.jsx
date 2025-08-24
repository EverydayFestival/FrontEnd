import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Header from "../components/Header.jsx";
import FestivalInfoForm from "../components/FestivalInfoForm.jsx";
import CompanyRecruitForm from "../components/CompanyRecruitForm.jsx";
import WorkerRecruitForm from "../components/WorkerRecruitForm.jsx";

function FestivalRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", image: null, startDate: "", endDate: "", city: "", district: "",
    detail: "", fee: "", timeStartHour: "18", timeStartMinute: "00",
    timeEndHour: "22", timeEndMinute: "00", introduction: "", link: "", tel: "",
    companyRecruit: "no", companyRecruitBegin: "", companyRecruitEnd: "",
    companyCategories: [], companyPreferred: "", companyNotice: "",
    companyQuestion1: "", companyQuestion2: "", companyQuestion3: "", companyQuestion4: "", companyQuestion5: "",
    workerRecruit: "no", workerRecruitBegin: "", workerRecruitEnd: "",
    job: "", wage: "", remark: "", workerNotice: "",
    workerQuestion1: "", workerQuestion2: "", workerQuestion3: "", workerQuestion4: "", workerQuestion5: "",
  });

  const companyCategoryOptions = [
    { label: "공연/예술", value: "ART" },
    { label: "오락", value: "ENTERTAINMENT" },
    { label: "체험", value: "EXPERIENCE" },
    { label: "판매", value: "SALES" },
    { label: "푸드", value: "FOOD" },
    { label: "홍보(캠페인)", value: "PROMOTION" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0]; // 선택한 첫 번째 파일
  setFormData((prev) => ({ ...prev, image: file }));
};

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newCategories = checked
        ? [...prev.companyCategories, value]
        : prev.companyCategories.filter((c) => c !== value);
      return { ...prev, companyCategories: newCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    let newFestivalId;
    const successMessages = ["축제 등록에 성공하였습니다!"];
    const errorMessages = [];

    try {
      // 1️⃣ 축제 등록
      const festivalData = {
        name: formData.name,
        imageUrl: null,
        period: {
          begin: `${formData.startDate}T${formData.timeStartHour}:${formData.timeStartMinute}:00`,
          end: `${formData.endDate}T${formData.timeEndHour}:${formData.timeEndMinute}:00`,
        },
        address: { city: formData.city, district: formData.district, detail: formData.detail },
        fee: formData.fee,
        time: `${formData.timeStartHour}:${formData.timeStartMinute} ~ ${formData.timeEndHour}:${formData.timeEndMinute}`,
        introduction: formData.introduction,
        link: formData.link,
        tel: formData.tel,
      };

      const festivalResponse = await fetch(`${import.meta.env.VITE_API_URL}/festivals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify(festivalData),
      });

      const festivalResult = await festivalResponse.json();
      if (!festivalResult.success) throw new Error(festivalResult.message || "축제 등록 실패");
      newFestivalId = festivalResult.data;

      // 2️⃣ 업체 모집 등록
      if (formData.companyRecruit === "yes") {
        const companyData = {
          begin: `${formData.companyRecruitBegin}T09:00:00`,
          end: `${formData.companyRecruitEnd}T18:00:00`,
          categories: formData.companyCategories,
          preferred: formData.companyPreferred,
          notice: formData.companyNotice,
          extraQuestions: [
            formData.companyQuestion1, formData.companyQuestion2, formData.companyQuestion3,
            formData.companyQuestion4, formData.companyQuestion5
          ].filter(q => q && q.trim() !== ""),
        };
        try {
          const companyRes = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${newFestivalId}/company-recruit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
            body: JSON.stringify(companyData),
          });
          const companyResult = await companyRes.json();
          if (companyResult.success) successMessages.push("업체 모집 등록 성공");
          else throw new Error(companyResult.message || "업체 모집 등록 실패");
        } catch (err) { errorMessages.push(err.message); }
      }

      // 3️⃣ 근로자 모집 등록
      if (formData.workerRecruit === "yes") {
        const laborData = {
          begin: `${formData.workerRecruitBegin}T09:00:00`,
          end: `${formData.workerRecruitEnd}T18:00:00`,
          job: formData.job, wage: formData.wage, remark: formData.remark,
          notice: formData.workerNotice,
          extraQuestions: [
            formData.workerQuestion1, formData.workerQuestion2, formData.workerQuestion3,
            formData.workerQuestion4, formData.workerQuestion5
          ].filter(q => q && q.trim() !== ""),
        };
        try {
          const laborRes = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${newFestivalId}/labor-recruit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
            body: JSON.stringify(laborData),
          });
          const laborResult = await laborRes.json();
          if (laborResult.success) successMessages.push("근로자 모집 등록 성공");
          else throw new Error(laborResult.message || "근로자 모집 등록 실패");
        } catch (err) { errorMessages.push(err.message); }
      }

      if (formData.image) {
        console.log("이미지 업로드 시작:", formData.image);
        const imgForm = new FormData();
        imgForm.append("ownerId", newFestivalId);
        imgForm.append("ownerType", "FESTIVAL");
        imgForm.append("image", formData.image);

        try {
          const imgRes = await fetch(`${import.meta.env.VITE_API_URL}/images`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: imgForm,
          });
          console.log("이미지 업로드 응답 상태:", imgRes.status, imgRes.statusText);
          const imgResult = await imgRes.json();
          console.log("이미지 업로드 응답 데이터:", imgResult);

          // 이미지 업로드 성공 시, 추가적인 요청 없이 성공 메시지 추가
          if (imgResult.success) {
            successMessages.push("이미지 업로드 성공");
          } else {
            // 업로드 실패 시, 에러 메시지 저장
            throw new Error(imgResult.message || "이미지 업로드 실패");
          }
        } catch (err) {
          console.error("이미지 업로드 에러:", err);
          errorMessages.push(`이미지 업로드 오류: ${err.message}`);
        }
      }

      // 5️⃣ 결과 알림 + 페이지 이동
      if (errorMessages.length > 0) alert(`일부 등록 실패:\n- ${errorMessages.join("\n- ")}`);
      else alert(successMessages.join("\n"));
      navigate(`/festivals/${newFestivalId}`);

    } catch (error) {
      console.error(error);
      alert(`오류 발생: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6">축제 등록하기</h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          <FestivalInfoForm 
            formData={formData} 
            handleChange={handleChange} 
            handleFileChange={handleFileChange} 
        />

          <CompanyRecruitForm
            formData={formData}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            companyCategoryOptions={companyCategoryOptions}
          />
          <WorkerRecruitForm formData={formData} handleChange={handleChange} />
          <button type="submit" className="w-full bg-rose-300 hover:bg-rose-400 text-white font-bold py-2 px-4 rounded">
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default FestivalRegister;

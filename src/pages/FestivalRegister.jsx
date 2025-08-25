import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Header from "../components/Header.jsx";
import FestivalInfoForm from "../components/FestivalInfoForm.jsx";
import CompanyRecruitForm from "../components/CompanyRecruitForm.jsx";
import WorkerRecruitForm from "../components/WorkerRecruitForm.jsx";
import "../styles/FestivalRegister.css";

function FestivalRegister() {
    const navigate = useNavigate();

    // ... (useState, 핸들러 함수, handleSubmit 로직은 변경 없음) ...
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
        const file = e.target.files[0];
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

            // ... (업체 모집, 근로자 모집, 이미지 업로드 로직은 그대로 유지) ...

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
        <div className="register-page-container">
            <Navbar />
            <Header />
            <div className="form-container">
                <h1 className="form-title">축제 등록하기</h1>
                <form onSubmit={handleSubmit}>
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

                    <WorkerRecruitForm 
                        formData={formData} 
                        handleChange={handleChange} 
                    />
                    
                    <button type="submit" className="submit-button">
                        등록하기
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FestivalRegister;

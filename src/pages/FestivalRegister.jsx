import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FestivalContext } from "../context/FestivalContext.jsx";
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
        { label: "공연/예술", value: "ART" }, { label: "오락", value: "ENTERTAINMENT" },
        { label: "체험", value: "EXPERIENCE" }, { label: "판매", value: "SALES" },
        { label: "푸드", value: "FOOD" }, { label: "홍보(캠페인)", value: "PROMOTION" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

        // --- 1. 기본 축제 정보 등록 ---
        const festivalData = {
            name: formData.name,
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

        try {
            const festivalResponse = await fetch(`${import.meta.env.VITE_API_URL}/festivals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(festivalData),
            });

            const festivalResult = await festivalResponse.json();
            if (!festivalResult.success) {
                throw new Error(festivalResult.message || "기본 축제 정보 등록에 실패했습니다.");
            }

            const newFestivalId = festivalResult.data;
            let successMessages = ["축제 등록에 성공하였습니다!"];
            let errorMessages = [];

            // --- 2. 업체 모집 공고 등록 (선택 사항) ---
            if (formData.companyRecruit === "yes") {
                const companyRecruitmentData = {
                    begin: `${formData.companyRecruitBegin}T09:00:00`,
                    end: `${formData.companyRecruitEnd}T18:00:00`,
                    categories: formData.companyCategories,
                    preferred: formData.companyPreferred,
                    notice: formData.companyNotice,
                    extraQuestions: [
                        formData.companyQuestion1, formData.companyQuestion2, formData.companyQuestion3,
                        formData.companyQuestion4, formData.companyQuestion5,
                    ].filter(q => q && q.trim() !== ''),
                };

                try {
                    const companyResponse = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${newFestivalId}/company-recruit`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                        body: JSON.stringify(companyRecruitmentData),
                    });
                    const companyResult = await companyResponse.json();
                    if (companyResult.success) {
                        successMessages.push("업체 모집 공고 등록에 성공했습니다.");
                    } else {
                        throw new Error(companyResult.message || "업체 모집 공고 등록에 실패했습니다.");
                    }
                } catch (companyError) {
                    errorMessages.push(companyError.message);
                }
            }

            // --- 3. 단기 근로자 모집 공고 등록 (선택 사항) ---
            if (formData.workerRecruit === "yes") {
                const laborRecruitmentData = {
                    begin: `${formData.workerRecruitBegin}T09:00:00`,
                    end: `${formData.workerRecruitEnd}T18:00:00`,
                    job: formData.job, wage: formData.wage, remark: formData.remark,
                    notice: formData.workerNotice,
                    extraQuestions: [
                        formData.workerQuestion1, formData.workerQuestion2, formData.workerQuestion3,
                        formData.workerQuestion4, formData.workerQuestion5,
                    ].filter(q => q && q.trim() !== ''),
                };

                try {
                    const laborResponse = await fetch(`${import.meta.env.VITE_API_URL}/festivals/${newFestivalId}/labor-recruit`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                        body: JSON.stringify(laborRecruitmentData),
                    });
                    const laborResult = await laborResponse.json();
                    if (laborResult.success) {
                        successMessages.push("근로자 모집 공고 등록에 성공했습니다.");
                    } else {
                        throw new Error(laborResult.message || "근로자 모집 공고 등록에 실패했습니다.");
                    }
                } catch (laborError) {
                    errorMessages.push(laborError.message);
                }
            }

            // --- 4. 최종 결과 알림 및 페이지 이동 ---
            if (errorMessages.length > 0) {
                alert(`일부 항목 등록 실패:\n- ${errorMessages.join("\n- ")}`);
            } else {
                alert(successMessages.join("\n"));
            }
            navigate(`/festivals/${newFestivalId}`);

        } catch (error) {
            console.error("축제 등록 과정 중 오류 발생:", error);
            alert(`오류가 발생했습니다: ${error.message}`);
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
                    <button type="submit" className="w-full bg-rose-300 hover:bg-rose-400 text-white font-bold py-2 px-4 rounded">등록하기</button>
                </form>
            </div>
        </div>
    );
}

export default FestivalRegister;
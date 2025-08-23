import React from 'react';

function CompanyRecruitForm({ formData, handleChange, handleCategoryChange, companyCategoryOptions }) {
    return (
        <>
            <fieldset className="space-y-4">
                <legend className="text-xl font-semibold border-b pb-2 mb-4 w-full">업체 모집</legend>
                <label className="font-semibold">업체 참여자 모집 여부 *</label>
                <div className="flex gap-4">
                    <label><input type="radio" name="companyRecruit" value="yes" checked={formData.companyRecruit === "yes"} onChange={handleChange} /> 예</label>
                    <label><input type="radio" name="companyRecruit" value="no" checked={formData.companyRecruit === "no"} onChange={handleChange} /> 아니오</label>
                </div>
            </fieldset>

            {formData.companyRecruit === "yes" && (
                <div className="space-y-4 pl-4 border-l-4">
                    <label className="block font-semibold">업체 모집 기간 *</label>
                    <div className="flex gap-2"><input type="date" name="companyRecruitBegin" value={formData.companyRecruitBegin} onChange={handleChange} className="border p-2 rounded" required /><span className="self-center">~</span><input type="date" name="companyRecruitEnd" value={formData.companyRecruitEnd} onChange={handleChange} className="border p-2 rounded" required /></div>
                    <label className="block font-semibold">업체 모집 분야 (복수 선택 가능) *</label>
                    <div className="flex flex-wrap gap-4">
                        {companyCategoryOptions.map((cat) => (
                            <label key={cat.value} className="flex items-center gap-2">
                                <input type="checkbox" name="companyCategories" value={cat.value} checked={formData.companyCategories.includes(cat.value)} onChange={handleCategoryChange} />
                                {cat.label}
                            </label>
                        ))}
                    </div>
                    <div><label className="block font-semibold">우대사항 기재</label><input type="text" name="companyPreferred" value={formData.companyPreferred} onChange={handleChange} className="border p-2 w-full rounded" /></div>
                    <div>
                        <h3 className="text-lg font-semibold mt-6">업체 모집 지원서 제작</h3>
                        <label className="block font-semibold">축제/행사 안내사항 (200자 이내)</label>
                        <textarea name="companyNotice" value={formData.companyNotice} onChange={handleChange} className="border p-2 w-full rounded" maxLength={200} placeholder="지원 업체에게 공통적으로 고지할 사항을 작성해주세요." />
                    </div>
                    <div>
                        <label className="block font-semibold">가능한 날짜와 시간 *</label>
                        <input type="text" disabled value="예시) 9/12 9:00 ~ 18:00, 9/13 13:00 ~ 18:00" className="border p-2 w-full rounded text-gray-500 bg-gray-100 cursor-not-allowed" readOnly />
                    </div>
                    <div>
                        <label className="block font-semibold">지원서 추가 질문</label>
                        {[1, 2, 3, 4, 5].map((num) => (<div key={`company-q-${num}`} className="flex items-center gap-2 mb-2"><input type="text" name={`companyQuestion${num}`} value={formData[`companyQuestion${num}`]} onChange={handleChange} className="border p-2 w-full rounded" placeholder={`질문 ${num}`} /></div>))}
                    </div>
                </div>
            )}
        </>
    );
}

export default CompanyRecruitForm;

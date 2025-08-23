import React from 'react';

function WorkerRecruitForm({ formData, handleChange }) {
    return (
        <>
            <fieldset className="space-y-4">
                <legend className="text-xl font-semibold border-b pb-2 mb-4 w-full">단기 근로자 모집</legend>
                <label className="font-semibold">단기 근로자 모집 여부 *</label>
                <div className="flex gap-4">
                    <label><input type="radio" name="workerRecruit" value="yes" checked={formData.workerRecruit === "yes"} onChange={handleChange} /> 예</label>
                    <label><input type="radio" name="workerRecruit" value="no" checked={formData.workerRecruit === "no"} onChange={handleChange} /> 아니오</label>
                </div>
            </fieldset>

            {formData.workerRecruit === "yes" && (
                <div className="space-y-4 pl-4 border-l-4">
                     <label className="block font-semibold">단기 근로자 모집 기간 *</label>
                     <div className="flex gap-2"><input type="date" name="workerRecruitBegin" value={formData.workerRecruitBegin} onChange={handleChange} className="border p-2 rounded" required /><span className="self-center">~</span><input type="date" name="workerRecruitEnd" value={formData.workerRecruitEnd} onChange={handleChange} className="border p-2 rounded" required /></div>
                    <div><label className="block font-semibold">업무 *</label><input type="text" name="job" value={formData.job} onChange={handleChange} className="border p-2 w-full rounded" required /></div>
                    <div><label className="block font-semibold">업무 수당 *</label><input type="text" name="wage" value={formData.wage} onChange={handleChange} className="border p-2 w-full rounded" placeholder="예시) 일급 15만원, 시급 12000원 등" required /></div>
                    <div><label className="block font-semibold">업무 특이사항(100자 이내)</label><input type="text" name="remark" value={formData.remark} onChange={handleChange} className="border p-2 w-full rounded" maxLength={100} placeholder="필요한 요구사항을 포함하여 자유롭게 기재" /></div>
                    <div>
                        <h3 className="text-lg font-semibold mt-6">단기 근로자 모집 지원서 제작</h3>
                        <label className="block font-semibold">축제/행사 안내사항 (200자 이내)</label>
                        <textarea name="workerNotice" value={formData.workerNotice} onChange={handleChange} className="border p-2 w-full rounded" maxLength={200} placeholder="지원 근로자에게 공통적으로 고지할 사항을 작성해주세요." />
                    </div>
                     <div>
                        <label className="block font-semibold">가능한 날짜와 시간 *</label>
                        <input type="text" disabled value="예시) 9/12 9:00 ~ 18:00, 9/13 13:00 ~ 18:00" className="border p-2 w-full rounded text-gray-500 bg-gray-100 cursor-not-allowed" readOnly />
                    </div>
                    <div>
                        <label className="block font-semibold">지원서 추가 질문</label>
                        {[1, 2, 3, 4, 5].map((num) => (<div key={`worker-q-${num}`} className="flex items-center gap-2 mb-2"><input type="text" name={`workerQuestion${num}`} value={formData[`workerQuestion${num}`]} onChange={handleChange} className="border p-2 w-full rounded" placeholder={`질문 ${num}`} /></div>))}
                    </div>
                </div>
            )}
        </>
    );
}

export default WorkerRecruitForm;

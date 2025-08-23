import React from 'react';

// 시간/분 옵션 렌더링 함수
const renderTimeOptions = (limit, step = 1) => {
    const options = [];
    for (let i = 0; i < limit; i += step) {
        const value = i.toString().padStart(2, "0");
        options.push(<option key={value} value={value}>{value}</option>);
    }
    return options;
};

function FestivalInfoForm({ formData, handleChange }) {
    return (
        <fieldset className="space-y-4">
            <legend className="text-xl font-semibold border-b pb-2 mb-4 w-full">기본 정보</legend>
            <div><label className="block font-semibold">축제/행사명 *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" required /></div>
            <div><label className="block font-semibold">이미지 넣기</label><input type="file" name="image" onChange={handleChange} className="border p-2 w-full rounded" /></div>
            <div>
                <label className="block font-semibold">행사 기간 *</label>
                <div className="flex flex-wrap items-center gap-2">
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="border p-2 rounded" required /><span className="mx-2">~</span><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="border p-2 rounded" required />
                </div>
            </div>
            <div>
                <label className="block font-semibold">장소 *</label>
                <div className="flex gap-2">
                    <input type="text" name="city" placeholder="시/도" value={formData.city} onChange={handleChange} className="border p-2 w-full rounded" required />
                    <input type="text" name="district" placeholder="시/군/구" value={formData.district} onChange={handleChange} className="border p-2 w-full rounded" />
                    <input type="text" name="detail" placeholder="상세주소" value={formData.detail} onChange={handleChange} className="border p-2 w-full rounded" required />
                </div>
            </div>
            <div>
                <label className="block font-semibold">행사 참가 비용 *</label>
                <select name="fee" value={formData.fee} onChange={handleChange} className="border p-2 w-full rounded" required>
                    <option value="">선택</option><option value="유료">유료</option><option value="무료">무료</option>
                </select>
            </div>
            <div>
                <label className="block font-semibold">행사 시간 *</label>
                <div className="flex flex-wrap items-center gap-2">
                    <select name="timeStartHour" value={formData.timeStartHour} onChange={handleChange} className="border p-2 rounded">{renderTimeOptions(24)}</select>시
                    <select name="timeStartMinute" value={formData.timeStartMinute} onChange={handleChange} className="border p-2 rounded">{renderTimeOptions(60, 15)}</select>분
                    <span className="mx-2">~</span>
                    <select name="timeEndHour" value={formData.timeEndHour} onChange={handleChange} className="border p-2 rounded">{renderTimeOptions(24)}</select>시
                    <select name="timeEndMinute" value={formData.timeEndMinute} onChange={handleChange} className="border p-2 rounded">{renderTimeOptions(60, 15)}</select>분
                </div>
            </div>
            <div><label className="block font-semibold">행사 개요 (200자 이내) *</label><textarea name="introduction" value={formData.introduction} onChange={handleChange} className="border p-2 w-full rounded" maxLength={200} required /></div>
            <div><label className="block font-semibold">공식사이트</label><input type="text" name="link" value={formData.link} placeholder="https://..." onChange={handleChange} className="border p-2 w-full rounded" /></div>
            <div><label className="block font-semibold">문의처 *</label><input type="tel" name="tel" value={formData.tel} placeholder="전화번호" onChange={handleChange} className="border p-2 w-full rounded" required /></div>
        </fieldset>
    );
}

export default FestivalInfoForm;

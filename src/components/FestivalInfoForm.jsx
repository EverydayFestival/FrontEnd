import React from 'react';

// 시간/분 옵션 렌더링 함수 (변경 없음)
const renderTimeOptions = (limit, step = 1) => {
    const options = [];
    for (let i = 0; i < limit; i += step) {
        const value = i.toString().padStart(2, "0");
        options.push(<option key={value} value={value}>{value}</option>);
    }
    return options;
};

function FestivalInfoForm({ formData, handleChange, handleFileChange }) {
    return (
        // 각 폼 섹션을 구분하는 클래스입니다.
        <fieldset className="form-section">
            <legend className="text-xl font-semibold border-b pb-2 mb-4 w-full">기본 정보</legend>
            
            {/* 각 '질문+입력칸'을 하나의 그룹으로 묶습니다. */}
            <div className="form-group">
                <label htmlFor="name">축제/행사명 *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
            </div>

            <div className="form-group">
                <label htmlFor="image">대표 이미지</label>
                <input type="file" id="image" name="image" onChange={handleFileChange} className="form-input" />
            </div>

            <div className="form-group">
                <label>행사 기간 *</label>
                {/* 여러 입력 필드를 가로로 배열할 때 사용합니다. */}
                <div className="input-grid">
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-input" required />
                    <span>~</span>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-input" required />
                </div>
            </div>

            <div className="form-group">
                <label>장소 *</label>
                <div className="input-grid">
                    <input type="text" name="city" placeholder="시/도" value={formData.city} onChange={handleChange} className="form-input" required />
                    <input type="text" name="district" placeholder="시/군/구" value={formData.district} onChange={handleChange} className="form-input" />
                    <input type="text" name="detail" placeholder="상세주소" value={formData.detail} onChange={handleChange} className="form-input" required />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="fee">행사 참가 비용 *</label>
                <select id="fee" name="fee" value={formData.fee} onChange={handleChange} className="form-select" required>
                    <option value="">선택</option>
                    <option value="유료">유료</option>
                    <option value="무료">무료</option>
                </select>
            </div>

            <div className="form-group">
                <label>행사 시간 *</label>
                <div className="input-grid">
                    <select name="timeStartHour" value={formData.timeStartHour} onChange={handleChange} className="form-select">{renderTimeOptions(24)}</select>
                    <select name="timeStartMinute" value={formData.timeStartMinute} onChange={handleChange} className="form-select">{renderTimeOptions(60, 15)}</select>
                    <span>~</span>
                    <select name="timeEndHour" value={formData.timeEndHour} onChange={handleChange} className="form-select">{renderTimeOptions(24)}</select>
                    <select name="timeEndMinute" value={formData.timeEndMinute} onChange={handleChange} className="form-select">{renderTimeOptions(60, 15)}</select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="introduction">행사 개요 (200자 이내) *</label>
                <textarea id="introduction" name="introduction" value={formData.introduction} onChange={handleChange} className="form-textarea" maxLength={200} required />
            </div>

            <div className="form-group">
                <label htmlFor="link">공식사이트</label>
                <input type="url" id="link" name="link" value={formData.link} placeholder="https://..." onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
                <label htmlFor="tel">문의처 *</label>
                <input type="tel" id="tel" name="tel" value={formData.tel} placeholder="전화번호" onChange={handleChange} className="form-input" required />
            </div>
        </fieldset>
    );
}

export default FestivalInfoForm;
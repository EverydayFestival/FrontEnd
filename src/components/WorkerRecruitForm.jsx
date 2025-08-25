import React from 'react';

function WorkerRecruitForm({ formData, handleChange }) {
    return (
        <>
            <fieldset className="form-section">
                <legend className="form-section-legend">단기 근로자 모집</legend>
                
                <div className="form-group">
                    <label>단기 근로자 모집 여부 *</label>
                    <div className="radio-group">
                        <label className="radio-item">
                            <input type="radio" name="workerRecruit" value="yes" checked={formData.workerRecruit === "yes"} onChange={handleChange} />
                            <span>예</span>
                        </label>
                        <label className="radio-item">
                            <input type="radio" name="workerRecruit" value="no" checked={formData.workerRecruit === "no"} onChange={handleChange} />
                            <span>아니오</span>
                        </label>
                    </div>
                </div>
            </fieldset>

            {formData.workerRecruit === "yes" && (
                <div className="form-section recruitment-details">
                    <div className="form-group">
                        <label>단기 근로자 모집 기간 *</label>
                        <div className="input-grid">
                            <input type="date" name="workerRecruitBegin" value={formData.workerRecruitBegin} onChange={handleChange} className="form-input" required />
                            <span>~</span>
                            <input type="date" name="workerRecruitEnd" value={formData.workerRecruitEnd} onChange={handleChange} className="form-input" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="job">업무 *</label>
                        <input type="text" id="job" name="job" value={formData.job} onChange={handleChange} className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="wage">업무 수당 *</label>
                        <input type="text" id="wage" name="wage" value={formData.wage} onChange={handleChange} className="form-input" placeholder="예시) 일급 15만원, 시급 12000원 등" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="remark">업무 특이사항 (100자 이내)</label>
                        <input type="text" id="remark" name="remark" value={formData.remark} onChange={handleChange} className="form-input" maxLength={100} placeholder="필요한 요구사항을 포함하여 자유롭게 기재" />
                    </div>

                    <div className="recruit-header">
                        <h3>단기 근로자 모집 지원서 제작</h3>
                    </div>

                    <div className="form-group">
                        <label htmlFor="workerNotice">축제/행사 안내사항 (200자 이내)</label>
                        <textarea id="workerNotice" name="workerNotice" value={formData.workerNotice} onChange={handleChange} className="form-textarea" maxLength={200} placeholder="지원 근로자에게 공통적으로 고지할 사항을 작성해주세요." />
                    </div>

                    <div className="form-group">
                        <label>필수 질문: 가능한 날짜와 시간 *</label>
                        <input type="text" disabled value="예시) 9/12 9:00 ~ 18:00, 9/13 13:00 ~ 18:00" className="form-input disabled-input" readOnly />
                    </div>

                    <div className="form-group">
                        <label>지원서 추가 질문 (선택)</label>
                        <div className="questions-wrapper">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <input 
                                    key={`worker-q-${num}`} 
                                    type="text" 
                                    name={`workerQuestion${num}`} 
                                    value={formData[`workerQuestion${num}`]} 
                                    onChange={handleChange} 
                                    className="form-input" 
                                    placeholder={`질문 ${num}`} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default WorkerRecruitForm;

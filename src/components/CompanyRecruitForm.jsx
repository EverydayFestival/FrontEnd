import React from 'react';

function CompanyRecruitForm({ formData, handleChange, handleCategoryChange, companyCategoryOptions }) {
    return (
        // React.Fragment(<></>)를 사용하여 여러 요소를 감쌉니다.
        <>
            <fieldset className="form-section">
                {/* legend 태그에도 CSS 클래스를 적용하여 일관성을 유지합니다. */}
                <legend className="form-section-legend">업체 모집</legend>
                
                <div className="form-group">
                    <label>업체 참여자 모집 여부 *</label>
                    <div className="radio-group">
                        <label className="radio-item">
                            <input type="radio" name="companyRecruit" value="yes" checked={formData.companyRecruit === "yes"} onChange={handleChange} />
                            <span>예</span>
                        </label>
                        <label className="radio-item">
                            <input type="radio" name="companyRecruit" value="no" checked={formData.companyRecruit === "no"} onChange={handleChange} />
                            <span>아니오</span>
                        </label>
                    </div>
                </div>
            </fieldset>

            {/* "예"를 선택했을 때만 나타나는 상세 폼 */}
            {formData.companyRecruit === "yes" && (
                <div className="form-section recruitment-details">
                    <div className="form-group">
                        <label>업체 모집 기간 *</label>
                        <div className="input-grid">
                            <input type="date" name="companyRecruitBegin" value={formData.companyRecruitBegin} onChange={handleChange} className="form-input" required />
                            <span>~</span>
                            <input type="date" name="companyRecruitEnd" value={formData.companyRecruitEnd} onChange={handleChange} className="form-input" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>업체 모집 분야 (복수 선택 가능) *</label>
                        <div className="checkbox-group">
                            {companyCategoryOptions.map((cat) => (
                                <label key={cat.value} className="checkbox-item">
                                    <input type="checkbox" name="companyCategories" value={cat.value} checked={formData.companyCategories.includes(cat.value)} onChange={handleCategoryChange} />
                                    <span>{cat.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="companyPreferred">우대사항 기재</label>
                        <input type="text" id="companyPreferred" name="companyPreferred" value={formData.companyPreferred} onChange={handleChange} className="form-input" />
                    </div>

                    <div className="recruit-header">
                        <h3>업체 모집 지원서 제작</h3>
                    </div>

                    <div className="form-group">
                        <label htmlFor="companyNotice">축제/행사 안내사항 (200자 이내)</label>
                        <textarea id="companyNotice" name="companyNotice" value={formData.companyNotice} onChange={handleChange} className="form-textarea" maxLength={200} placeholder="지원 업체에게 공통적으로 고지할 사항을 작성해주세요." />
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
                                    key={`company-q-${num}`} 
                                    type="text" 
                                    name={`companyQuestion${num}`} 
                                    value={formData[`companyQuestion${num}`]} 
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

export default CompanyRecruitForm;

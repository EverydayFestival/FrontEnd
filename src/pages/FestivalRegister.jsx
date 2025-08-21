import Header from "../components/Header";
import React, { useState, useContext } from "react";
import { FestivalContext } from "../context/FestivalContext.jsx";
import { useNavigate } from "react-router-dom";
//import { addFestival } from "../data/festivals.js";
// import { createFestival } from "../services/festivalApi";

export default function FestivalRegister() {
  const { addFestival } = useContext(FestivalContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyRecruitCategory: [],
  });

  const [requiredQuestions, setRequiredQuestions] = useState({
    company: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    },
    worker: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // API 데이터 구조에 맞춰 새로운 데이터 객체를 생성합니다.
    const newFestivalData = {
      festivalOnlyDto: {
        name: formData.title,
        fee: formData.feeType,
        time: formData.time,
        introduction: formData.summary,
        tel: formData.plannerPhone,
        link: formData.website,
        holderName: formData.plannerName,
        imageUrl: null, // 이미지 업로드는 추후 구현
        periodDto: {
          begin: formData.startDate,
          end: formData.endDate,
        },
        addressDto: {
          city: formData.city || "미정",
          district: formData.district || "",
          detail: formData.location,
        },
        favorStatus: "NOT_FAVORED", // 기본값
        applyStatus: "NOT_APPLIED", // 기본값
      },
      companyRecruitStatus: formData.companyRecruit === "yes" ? "RECRUITING" : "NOT_RECRUITING",
      companyRecruitDto:
        formData.companyRecruit === "yes"
          ? {
              id: Math.floor(Math.random() * 1000), // 임시 ID
              periodDto: {
                begin: formData.companyRecruitStartDate,
                end: formData.companyRecruitEndDate,
              },
              notice: formData.companyNotice || "",
              preferred: formData.companyPreferred || "",
              categories: formData.companyRecruitCategory,
              // questions, required 등은 API 명세에 따라 추가/제외
            }
          : null,
      laborRecruitStatus: formData.workerRecruit === "yes" ? "RECRUITING" : "NOT_RECRUITING",
      laborRecruitDto:
        formData.workerRecruit === "yes"
          ? {
              id: Math.floor(Math.random() * 1000), // 임시 ID
              periodDto: {
                begin: formData.workerRecruitStartDate, // 업체/근로자 모집 기간 분리
                end: formData.workerRecruitEndDate,
              },
              notice: formData.workerNotice || "",
              job: formData.task,
              wage: formData.taskMoney,
              remark: formData.taskSpecial || "",
            }
          : null,
    };

    // addFestival 함수에 새로 만든 data 객체를 전달합니다.
    const newFestival = addFestival(newFestivalData);

    alert("축제 등록에 성공하였습니다!");
    navigate(`/festivals/${newFestival.id}`);
  };

  return (
    <div>
      {/* 상단 헤더 */}
      <Header />

      {/* 등록 폼 */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6">축제 등록하기</h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 1. 기본 정보 */}
          <fieldset className="space-y-4">
            <div>
              <label className="block font-semibold">축제/행사명 *</label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">이미지 넣기</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">행사 기간 *</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
                <span className="self-center">~</span>
                <input
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold">장소 *</label>
              <input
                type="text"
                name="location"
                onChange={handleChange}
                placeholder="상세주소"
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">행사 참가 비용 *</label>
              <select
                name="feeType"
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              >
                <option value="">전체</option>
                <option value="전체">전체</option>
                <option value="유료">유료</option>
                <option value="무료">무료</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">행사 시간 *</label>
              <input
                type="text"
                name="time"
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">
                행사 개요 (200자 이내)*
              </label>
              <textarea
                name="summary"
                onChange={handleChange}
                className="border p-2 w-full rounded"
                maxLength={200}
                required
              />
            </div>

            <div>
              <label className="block font-semibold">공식사이트 *</label>
              <input
                type="url"
                name="website"
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>
          </fieldset>

          {/* 2. 기획자 정보 */}
          <fieldset className="space-y-4">
            <h2 className="text-xl font-semibold">기획자 정보 *</h2>
            <input
              type="text"
              name="plannerName"
              placeholder="이름/기관 명"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="tel"
              name="plannerPhone"
              placeholder="전화번호"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </fieldset>

          {/* 3. 업체 모집 여부 */}
          <fieldset className="space-y-4">
            <label className="font-semibold">업체 참여자 모집 여부 *</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="companyRecruit"
                  value="yes"
                  onChange={handleChange}
                />{" "}
                예
              </label>
              <label>
                <input
                  type="radio"
                  name="companyRecruit"
                  value="no"
                  onChange={handleChange}
                />{" "}
                아니오
              </label>
            </div>
          </fieldset>

          {/* "예" 선택 시 추가 입력란 표시*/}
          {formData.companyRecruit === "yes" && (
            <div className="space-y-4">
              <label className="block font-semibold">업체 모집 기간 *</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  name="companyRecruitStartDate"
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
                <span className="self-center">~</span>
                <input
                  type="date"
                  name="companyRecruitEndDate"
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
              </div>
            </div>
          )}

                    {/* 업체 모집 분야 */}
          {formData.companyRecruit === "yes" && (
            <div className="space-y-4">
              <label className="block font-semibold">업체 모집 분야 *(복수 선택 가능)</label>
              <div className="flex flex-wrap gap-4">
                {["공연/예술", "오락", "체험", "판매", "푸드", "홍보(캠페인)", "기타"].map(
                  (category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="companyRecruitCategory"
                        value={category}
                        checked={formData.companyRecruitCategory.includes(category)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          setFormData((prev) => {
                            const newCategories = checked
                              ? [...prev.companyRecruitCategory, value]
                              : prev.companyRecruitCategory.filter((c) => c !== value);
                            return { ...prev, companyRecruitCategory: newCategories };
                          });
                        }}
                      />
                      {category}
                    </label>
                  )
                )}
              </div>
            </div>
          )}

                    {/* 기타 선택 시 정보 입력 */}
          {formData.companyRecruit === "yes" &&
            formData.companyRecruitCategory.includes("기타") && (
              <div className="space-y-4">
                <label className="block font-semibold">기타 선택 시 정보를 입력해주세요</label>
                <input
                  type="text"
                  name="companyRecruitCategoryOther"
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
              </div>
            )}

                      {/* 우대사항 기재 */}
          {formData.companyRecruit === "yes" && (
            <div className="space-y-4">
              <label className="block font-semibold">우대사항 기재</label>
              <input
                type="text"
                name="companyPreferred"
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
          )}


          {formData.companyRecruit === "yes" && (
            <div className="mt-4 space-y-6 border-t pt-4">
              {/* 1. 업체 모집 안내 */}
              <h3 className="text-lg font-semibold">
                업체 모집을 위한 지원서 제작
              </h3>
              <small>
                기본 질문( 업체 분야, 업체명, 업체 전화번호, 이메일)은 지원서 폼에
                이미 작성 되어있으니 아래 새롭게 작성하시는 질문에 중복하여
                입력하지 마시기 바랍니다.
              </small>

              {/* 2. 안내사항 */}
              <div>
                <label className="block font-semibold">
                  축제/행사 안내사항 (200자 이내)
                </label>
                <textarea
                  name="companyNotice"
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                  maxLength={200}
                  placeholder="본 축제(또는 행사)에 지원한 업체에게 공통적으로 고지할 사항이 있다면 작성해주세요
                        e.g. 축제의 상세한 날짜와 시간 등"
                />
              </div>

              {/* 3. 가능한 날짜와 시간 */}
              <div>
                <label className="block font-semibold">
                  가능한 날짜와 시간 *
                  <span className="text-sm font-normal text-gray-500 block">
                    (업체가 축제에 참가 가능한 시간입니다.)
                  </span>
                </label>
                <input
                  type="text"
                  disabled
                  value="예시) 9/12 9:00 ~ 18:00, 9/13 13:00 ~ 18:00"
                  className="border p-2 w-full rounded text-gray-500 bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* 4. 질문 1~5 */}
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center gap-2">
                  <label className="block font-semibold">질문 {num}</label>
                  <input
                    type="text"
                    name={`question${num}`}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                  <label>
                    <input
                      type="checkbox"
                      name={`requiredCompanyQuestion${num}`}
                      checked={requiredQuestions.company[num]}
                      onChange={(e) => {
                        setRequiredQuestions((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            [num]: e.target.checked,
                          },
                        }));
                      }}
                    />
                    필수
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* 4. 단기 근로자 모집 */}
          <fieldset className="space-y-4">
            <label className="font-semibold">단기 근로자 모집 여부 *</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="workerRecruit"
                  value="yes"
                  onChange={handleChange}
                />{" "}
                예
              </label>
              <label>
                <input
                  type="radio"
                  name="workerRecruit"
                  value="no"
                  onChange={handleChange}
                />{" "}
                아니오
              </label>
            </div>
          </fieldset>

          {formData.workerRecruit === "yes" && (
            <>
              <div className="mt-4 space-y-6 border-t pt-4">
                <label className="block font-semibold">단기 근로자 기간 *</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="startDate"
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                  <span className="self-center">~</span>
                  <input
                    type="date"
                    name="endDate"
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold">업무 *</label>
                  <input
                    type="text"
                    name="task"
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold">업무 수당 *</label>
                  <input
                    type="text"
                    name="taskMoney"
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="예시) 일급 15만원, 시급 12000원 등"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold">
                    업무 특이사항(100자 이내)
                  </label>
                  <input
                    type="text"
                    name="taskSpecial"
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    maxLength={100}
                    placeholder="필요한 요구사항을 포함하여 자유롭게 기재"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-6 border-t pt-4">
                {/* 1. 업체 모집 안내 */}
                <h3 className="text-lg font-semibold">
                  단기 근로자 모집을 위한 지원서 제작
                </h3>
                <small>
                  기본 질문( 이름, 성별, 나이, 전화번호, 이메일)은 지원서 폼에 이미
                  작성 되어있으니 아래 새롭게 작성하시는 질문에 중복하여
                  입력하지 마시기 바랍니다.
                </small>

                {/* 2. 안내사항 */}
                <div>
                  <label className="block font-semibold">
                    축제/행사 안내사항 (200자 이내)
                  </label>
                  <textarea
                    name="companyNotice"
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    maxLength={200}
                    placeholder="본 축제(또는 행사)에 지원한 근로자에게 공통적으로 고지할 사항이 있다면 작성해주세요
                        e.g. 축제의 상세한 날짜와 시간 등"
                  />
                </div>

                {/* 3. 가능한 날짜와 시간 */}
                <div>
                  <label className="block font-semibold">
                    가능한 날짜와 시간 *
                    <span className="text-sm font-normal text-gray-500 block">
                      (단기 근로자가 축제에 참가 가능한 시간입니다.)
                    </span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value="예시) 9/12 9:00 ~ 18:00, 9/13 13:00 ~ 18:00"
                    className="border p-2 w-full rounded text-gray-500 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>

                {/* 4. 질문 1~5 */}
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <label className="block font-semibold">질문 {num}</label>
                    <input
                      type="text"
                      name={`question${num}`}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                    />
                    <label>
                      <input
                        type="checkbox"
                        name={`requiredWorkerQuestion${num}`}
                        checked={requiredQuestions.worker[num]}
                        onChange={(e) => {
                          setRequiredQuestions((prev) => ({
                            ...prev,
                            worker: {
                              ...prev.worker,
                              [num]: e.target.checked,
                            },
                          }));
                        }}
                      />
                      필수
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full bg-rose-300 hover:bg-rose-400 text-white font-bold py-2 px-4 rounded"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
}


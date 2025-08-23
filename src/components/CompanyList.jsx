import { useEffect, useState } from "react";
import React from "react";
import CompanyCard from "./CompanyCard";

function CompanyList({ companies }) {
    if (!companies || companies.length === 0) {
    return (
      <div className="w-full text-center p-10">등록된 업체가 없습니다.</div>
    );
  }

return (
    // card-container 스타일은 Home.jsx에서 이미 적용하고 있으므로
    // 여기서는 grid 레이아웃만 정의합니다.
    <>
      {companies.map((company) => (
        // key와 company prop을 올바르게 전달합니다. (기존 코드의 compnay 오타 수정)
        <CompanyCard key={company.companyId} company={company} />
      ))}
    </>
  );
}

export default CompanyList;
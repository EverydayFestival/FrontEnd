import React from "react";


function Tabs({selectedTab, setSelectedTab}) {
  return (
    <div className="tab-wrapper">
      <div className="tabs">
        <button
          className={selectedTab === 'festival' ? 'active' : ''}
          onClick={() => setSelectedTab('festival')}
        >
          축제 둘러보기
        </button>
        <button
          className={selectedTab === 'company' ? 'active' : ''}
          onClick={() => setSelectedTab('company')}
          >
            업체 둘러보기
        </button>
        {/* <SortFilter
          selected={selectedSort}
          setSelected={setSelectedSort}
        /> */}
    </div>
  </div>
  );
}

export default Tabs;

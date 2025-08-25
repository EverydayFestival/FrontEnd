import React from "react";
import styled from "styled-components";


function Tabs({ selectedTab, setSelectedTab }) {
  return (
    <TabWrapper>
      <TabButton
        active={selectedTab === "festival"}
        onClick={() => setSelectedTab("festival")}
      >
        축제 둘러보기
      </TabButton>
      <TabButton
        active={selectedTab === "company"}
        onClick={() => setSelectedTab("company")}
      >
        업체 둘러보기
      </TabButton>
    </TabWrapper>
  );
}

export default Tabs;

// styled-components
const TabWrapper = styled.div`
  display: flex;
  justify-content: left;
  padding-left: 20px;
  gap: 20px;
  margin: 20px 0;
`;

const TabButton = styled.button`
  width: 167px;
  height: 50px;
  border-radius: 40px;
  border: none;
  background-color: ${(props) => (props.active ? "#F98771" : "#FEA898")};
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fcb5aa;
  }
`;
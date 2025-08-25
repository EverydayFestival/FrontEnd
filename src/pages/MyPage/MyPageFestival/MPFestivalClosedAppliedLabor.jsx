import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../../components/Navbar';
import labor_data from '../../../assets/labor/labor_data';
import fest_data from '../../../assets/fest/fest_data';
import { useParams } from 'react-router-dom';
import Box from '../../../components/Box';
import Modal from '../../../components/Modal';

const MPFestivalClosedAppliedLabor = () => {
    const [activeFilter, setActiveFilter] = useState('지원순');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const {festivalId} = useParams();
    const [festivalInfo, setFestivalInfo] = useState(null); // 축제 정보
    // const festival = fest_data.find(f => f.festivalId === Number(festivalId));

    // const [laborList, setLaborList] = useState(labor_data);

    //단기근로자 지원현황 
    const [appliedLabors, setAppliedLabors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const filters = ['지원순', '수락', '거절'];
    const [filteredLabors, setFilteredLabors] = useState([]);

    useEffect(() => {
      switch (activeFilter) {
        case "지원순":
          setFilteredLabors(appliedLabors);
          break;
        case "수락":
          setFilteredLabors(appliedLabors.filter((la) => la.selected === "ACCEPTED"));
          break;
        case "거절":
          setFilteredLabors(appliedLabors.filter((la) => la.selected === "DENIED"));
          break;
        default:
          setFilteredLabors(appliedLabors);
      }
    }, [activeFilter, appliedLabors]);

    //모달팝업
    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); //{id, status}
    
    // const openModal = (laborId, statusType) => {
    //   setPendingAction({id: laborId, status: statusType});
    //   setShowModal(true);
    // }
    const confirmModal = () => {
      if(pendingAction) {
        handleChoice(pendingAction.id, pendingAction.status);
      }
      setShowModal(false);
      setPendingAction(null);
    }

    //api
    const viewAppliedLabors = async() => {
      try{
        setError("");
    
        const response = await fetch(
          `https://festival-everyday.duckdns.org/festivals/${festivalId}/labor-applications?page=0&size=` ,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              Accept: "application/json",
              "Content-type": "application/json",
            },
          }
        );
    
    
    
        const result = await response.json();
      
        if(!response.ok || result.success !== true) {
          throw new Error(result.message || "단기근로자 지원현황 조회에 실패했습니다.");
        }
        
        setAppliedLabors(result.data.content ?? []);
        console.log(result.data.content);
      }catch(error){
        console.error("Error fetching applied labors:", error);
        setError(error.message);
      }
    };
  
    //축제이름 찾기 api 시작
    const viewFestivalInfo = async () => {
      try {
        const response = await fetch(
          `https://festival-everyday.duckdns.org/users/me/festivals?holdStatus=ENDED&page=0&size=`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              Accept: "application/json",
            },
          }
        );
  
        const result = await response.json();
  
        if (!response.ok || result.success !== true) {
          throw new Error(result.message || "축제 정보 조회에 실패했습니다.");
        }
  
        // 목록에서 festivalId에 해당하는 데이터 찾기
        const foundFestival = result.data.content.find(
          (fest) => fest.id === Number(festivalId)
        );
        setFestivalInfo(foundFestival || null);
      } catch (error) {
        console.error("Error fetching festival info:", error);
        setError(error.message);
      }
    };
  
    // 두 API 호출하기
    useEffect(() => {
      setLoading(true);
      Promise.all([viewAppliedLabors(), viewFestivalInfo()]).finally(() =>
        setLoading(false)
      );
    }, [festivalId]);

    // 드롭다운 외부 클릭 감지용 effect
        useEffect(() => {
          const handleClickOutside = (e) => {
            if (dropdownOpen && !e.target.closest(".dropdown-container")) {
              setDropdownOpen(false);
            }
          };
    
          document.addEventListener("mousedown", handleClickOutside);
          return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [dropdownOpen]);
      


    const handleChoice = (laborId, newStatus) => {
    setAppliedLabors(prev =>
      prev.map(la =>
        la.id === laborId ? { ...la, selected: newStatus } : la
      )
    );
  };

	if (loading) return <p style={{ padding: "150px" }}>불러오는 중...</p>;
	if (error) return <p style={{ padding: "150px", color: "red" }}>{error}</p>;
  // api 관련 코드 끝

  return (
    <Box>
    <PageWrapper>
      <Fixed>
        <Navbar />
        <Title>
          <p>단기 근로자 지원현황</p>
        </Title>
      </Fixed>

      <Name>
          <p>{festivalInfo?.name ?? "축제 이름 불러오는 중"}</p>
      <FilterSection>
        <Dropdown>
          <DropdownBtn onClick={() => setDropdownOpen(!dropdownOpen)}>
            {activeFilter} ▾
          </DropdownBtn>
          {dropdownOpen && (
            <DropdownContent>
              {filters.map((filter, idx) => (
                <DropdownItem
                  key={idx}
                  onClick={() => {
                    setActiveFilter(filter);
                    setDropdownOpen(false);
                  }}
                >
                  {filter}
                </DropdownItem>
              ))}
            </DropdownContent>
          )}
        </Dropdown>
      </FilterSection>
      </Name>


      {/* <ApplyLaborList>
        {laborList.map((la, index) => (
          <LaborCard key={index}>
            <LaborImage src={la.image} alt="단기근로자이미지" />
            <Laborleft>
              <LaborInfo>
                <LaborName>{la.laborName}</LaborName>
                <ApplicationBtn>지원서 보기</ApplicationBtn>
              </LaborInfo>
            </Laborleft>



            <LaborChoice>
              {la.laborSelected === null && (
                <>
                  <ChoiceBtnYes onClick={() => handleChoice(la.laborId, true)}>수락하기</ChoiceBtnYes>
                  <ChoiceBtnNo onClick={() => handleChoice(la.laborId, false)}>거절하기</ChoiceBtnNo>
                </>
              )}

              {la.laborSelected === true && (
                <>
                  <ChoiceBtnY disabled>수락됨</ChoiceBtnY>
                </>
              )}

              {la.laborSelected === false && (
                <ChoiceBtnN disabled>거절됨</ChoiceBtnN>
              )}
          </LaborChoice>
          </LaborCard>
        ))}
      </ApplyLaborList> */}

     <ApplyLaborList>
      { filteredLabors.length === 0 ? (
        <p>해당 조건에 맞는 단기 근로자가 없어요!</p>
       ) : (
        filteredLabors.map((la) => (
          <LaborCard key={la.id}>
            <LaborImage src={la.imageUrl} alt="단기근로자이미지" />
            <Laborleft>
              <LaborInfo>
                <LaborName>{la.name}</LaborName>
                <ApplicationBtn>지원서 보기</ApplicationBtn>
              </LaborInfo>
            </Laborleft>



            <LaborChoice>
              {la.selected === "NEUTRAL" && (
                <>
                  <ChoiceBtnYes disabled>수락하기</ChoiceBtnYes>
                  <ChoiceBtnNo disabled>거절하기</ChoiceBtnNo>
                </>
              )}

              {la.selected === "ACCEPTED" && (
                <>
                  <ChoiceBtnY disabled>수락됨</ChoiceBtnY>
                </>
              )}

              {la.selected === "DENIED" && (
                <ChoiceBtnN disabled>거절됨</ChoiceBtnN>
              )}
          </LaborChoice>
          </LaborCard>
        )))
       }
      
       
      </ApplyLaborList>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmModal}
        type="cancel"
      >
        <p>
          {pendingAction?.status === "ACCEPTED"
            ? "해당 단기 근로자를 수락하시겠습니까?"
            : "해당 단기 근로자를 거절하시겠습니까?"}
        </p>
      </Modal>

    </PageWrapper>
    </Box>
  );
};

export default MPFestivalClosedAppliedLabor;

/* styled-components */
const PageWrapper = styled.div`
  padding-top: 180px;  
`;

const Fixed = styled.div`
  position: fixed;  
  top: 0;
  left: 0;
  width: 100%;
  /* background-color: white; */
  z-index: 1000; /* 다른 요소보다 위 */
`;

const Title = styled.div`
  background: #FEA898;
  font-size: 20px;
  font-weight: 800;
  padding: 10px 0 10px 270px;
`;

const Name = styled.div`
  position: fixed;
  top: 124px; /* Title 밑에 위치하도록 (Title 높이에 맞춰 조정) */
  left: 200px; /* Box의 left Sidebox 폭만큼 오른쪽으로 밀기 */
  right: 200px; /* Box의 right Sidebox 폭만큼 여백 */
  
  display: flex;
  justify-content: space-between; /* 좌우로 나눔 */
  align-items: center;
  font-size: 18px;
  background-color: white;
  padding: 16px 20px;
  z-index: 500; 
  border-bottom: 2px solid #eee; /* 깔끔한 구분선 optional */
`;

const FilterSection = styled.div`
  display: flex;
  /* justify-content: right; */
  /* padding-right: 110px;
  margin: 20px 0; */
`;

const Dropdown = styled.div.attrs({ className: "dropdown-container" })`
  position: relative;
  display: inline-block;
  
`;

const DropdownBtn = styled.button`
  padding: 10px 20px;
  font-size: 16px;

  border-radius: 15px;
  border: 1px solid #a4a3a3;
  background-color: white;
  cursor: pointer;

  &:hover{
    background-color: #e4e0e0;
  }
  
`;

const DropdownContent = styled.div`
  margin-top: 10px;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 130px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10;

  border-radius: 15px;
  border: 1px #a4a3a3;

  font-size: 14px;
  text-align: center;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

const ApplyLaborList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
`;

// const LaborCard = styled.div`
//   display: flex;
//   align-items: center;
//   width: 80%;
//   max-width: 1000px;
//   gap: 20px;
//   padding: 15px 15px 15px 40px;
//   border: 1px solid #ddd;
//   border-radius: 10px;
// `;

const LaborImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
`;

const LaborInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* 100px → 줄여줌 */
`;

const Laborleft = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column; /* 세로 배치 */
  justify-content: center;
  margin-left: 20px;
`;

const LaborCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* 좌쪽 정보 / 우측 버튼 나눔 */
  align-items: center;
  width: 80%;
  max-width: 1000px;
  gap: 20px;
  padding: 20px 30px;
  border: 1px solid #ddd;
  border-radius: 10px;

  @media (max-width: 768px) {
    flex-direction: column; /* 모바일/태블릿에서는 세로로 정렬 */
    align-items: flex-start; /* 좌측 정렬 */
  }
`;



const LaborName = styled.span`
  font-weight: 400;
  font-size: 18px;
  display: flex;
`;

const ApplicationBtn = styled.button`
  /* display: inline-block; */
    width: 120px;
    height: 40px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #F4EDED;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    &:hover{
      background-color: #dcd7d7;
    }

`;

const LaborChoice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end; /* 카드 오른쪽 끝에 정렬 */

   @media (max-width: 768px) {
    align-items: stretch; /* 모바일에서 꽉 차게 */
    width: 100%; 
  }
`;


const ChoiceBtnYes = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #F4EDED;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);

     @media (max-width: 800px) {
    width: 100%; /* 모바일에서는 꽉 채우기 */
  }

`;


const ChoiceBtnNo = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #F4EDED;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
`;

const ChoiceBtnY = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border:none;

    background: #BAE4A4;

    color: black;
`;

const ChoiceBtnN = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border:none;

    background: #CD7D6D;
   

    color: black;

`;




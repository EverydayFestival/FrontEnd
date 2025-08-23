import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../../components/Navbar';
import labor_data from '../../../assets/labor/labor_data';
import fest_data from '../../../assets/fest/fest_data';
import { useParams } from 'react-router-dom';
import Box from '../../../components/Box';
import Modal from '../../../components/Modal';

const MPFestivalAppliedLabor = () => {

    const {festivalId} = useParams();
    const [festivalInfo, setFestivalInfo] = useState(null); // 축제 정보
    // const festival = fest_data.find(f => f.festivalId === Number(festivalId));

    // const [laborList, setLaborList] = useState(labor_data);

    //단기근로자 지원현황 
    const [appliedLabors, setAppliedLabors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //모달팝업
    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); //{id, status}
    
    const openModal = (laborId, statusType) => {
      setPendingAction({id: laborId, status: statusType});
      setShowModal(true);
    }
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
        setLoading(true);
        setError("");
    
        const response = await fetch(
          `https://festival-everyday.duckdns.org/festivals/${festivalId}/labor-applications?page=0&size=2` ,
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
      }finally{
        setLoading(false);
      }
    };
  
    //축제이름 찾기 api 시작
    const viewFestivalInfo = async () => {
      try {
        const response = await fetch(
          `https://festival-everyday.duckdns.org/users/me/festivals?holdStatus=ONGOING&page=0&size=5`,
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
      {appliedLabors.length === 0 ? (
        <p>해당 축제에 지원한 단기 근로자가 없습니다.</p>
       ) : (
        appliedLabors.map((la) => (
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
                  <ChoiceBtnYes onClick={() => openModal(la.id, "ACCEPTED")}>수락하기</ChoiceBtnYes>
                  <ChoiceBtnNo onClick={() => openModal(la.id, "DENIED")}>거절하기</ChoiceBtnNo>
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
        )))}
       
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

export default MPFestivalAppliedLabor;

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

const ApplyLaborList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const LaborCard = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  max-width: 1000px;
  gap: 20px;
  padding: 15px 15px 15px 40px;
  border: 1px solid #ddd;
  border-radius: 10px;
`;

const LaborImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
`;

const Laborleft = styled.div`
  display: flex;
  flex: 1;
  margin-left: 20px;
  align-items: center;
`;
const LaborInfo = styled.div`
  p{
    font-size: 14px;
  }
  display: flex;
  flex-direction: column;
  gap: 100px;

  

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

`;

const LaborChoice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;


`;

const ChoiceBtnYes = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #F4EDED;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;

    &:hover{
      background-color: #91b37e;
      border: none;
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
    cursor: pointer;

    &:hover{
      background-color: #9E655A;
      border: none;
    }
`;

const ChoiceBtnY = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #BAE4A4;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;
    color: black;
`;

const ChoiceBtnN = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #CD7D6D;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;
    color: black;

`;




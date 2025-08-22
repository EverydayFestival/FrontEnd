import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../../components/Navbar';
import labor_data from '../../../assets/labor/labor_data';
import fest_data from '../../../assets/fest/fest_data';
import { useParams } from 'react-router-dom';
import Box from '../../../components/Box';

const MPFestivalAppliedLabor = () => {

    const {festivalId} = useParams();
    const festival = fest_data.find(f => f.festivalId === Number(festivalId));

    const [laborList, setLaborList] = useState(labor_data);
    const handleChoice = (laborId, choice) => {
    setLaborList(prev =>
      prev.map(la =>
        la.laborId === laborId ? { ...la, laborSelected: choice } : la
      )
    );
  };
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
             <p>{festival?.festivalName}</p>
      </Name>


      <ApplyLaborList>
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
      </ApplyLaborList>
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
  z-index: 1000; 
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
    font-size: 18px;
  }
  display: flex;
  flex-direction: column;
  gap: 10px;

  

`;


const LaborName = styled.span`
  font-weight: 700;
  font-size: 22px;
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
      background-color: #B2AEAE;
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
`;

const ChoiceBtnN = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #B2AEAE;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;

`;


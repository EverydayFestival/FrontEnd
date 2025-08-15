import React from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import labor_data from '../../assets/labor/labor_data';
import { useLocation, useParams } from 'react-router-dom';

const MPFestivalAppliedLabor = () => {

    const {festivalId} = useParams();
    const location = useLocation();
    const festivalName = location.state?.festivalName || '';

  return (
    <PageWrapper>
      <Fixed>
        <Navbar />
        <Title>
          <p>단기 근로자 지원현황</p>
        </Title>
      </Fixed>

      <p>festivalName: {festivalName}</p>
      <p>festivalId: {festivalId}</p>

      <ApplyLaborList>
        {labor_data.map((labor, index) => (
          <LaborCard key={index}>
            <LaborImage src={labor.image} alt="단기근로자이미지" />
            <Laborleft>
              <LaborInfo>
                <LaborName>{labor.laborName}</LaborName>
                <ApplicationBtn>지원서 보기</ApplicationBtn>
              </LaborInfo>
            </Laborleft>



            <LaborChoice>
              <ChoiceBtn>수락하기</ChoiceBtn>
              <ChoiceBtn>거절하기</ChoiceBtn>
            </LaborChoice>
          </LaborCard>
        ))}
      </ApplyLaborList>
    </PageWrapper>
  );
};

export default MPFestivalAppliedLabor;

/* styled-components */
const PageWrapper = styled.div`
  padding-top: 200px;  
`;

const Fixed = styled.div`
  position: fixed;  
  top: 0;
  left: 0;
  width: 100%;
  background-color: white; /* 투명 배경 방지 */
  z-index: 1000; /* 다른 요소보다 위 */
`;

const Title = styled.div`
  background-color: rgb(199, 199, 199);
  font-size: 22px;
  padding: 30px 0 30px 270px;
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
  margin-top: 30px;
  padding: 8px 12px;
  width: 150px;
  height: 50px;
  cursor: pointer;
`;


const LaborChoice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;


`;

const ChoiceBtn = styled.button`
    width: 200px;
    padding: 20px 0;
    cursor: pointer;
`;


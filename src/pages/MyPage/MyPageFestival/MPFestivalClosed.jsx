import React from 'react';
import styled from 'styled-components';
import fest_data from '../../../assets/fest/fest_data';
import Navbar from '../../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Box from '../../../components/Box';

const MPFestivalClosed = () => {

  const navigate = useNavigate();
  
  return (
    <Box>
    <FestivalClosed>
      <Fixed>
        <Navbar />
        <Title>
          <p>종료된 행사</p>
        </Title>
      </Fixed>


      <FestCardList>
        {fest_data.map((fest, index) => (
          <FestCard key={index}>
            <FestImage src={fest.image} alt="" />
            <FestInfo>
              <FestName>{fest.festivalName}</FestName>
              <p>{fest.location}</p>
              <p>{fest.period}</p>
            </FestInfo>

            <RecruitStatus>
              <button onClick={() => navigate(`/mypage/festival/appliedcompany/${fest.festivalId}`)}>
                업체 지원현황
              </button>
              <button onClick={() => navigate(`/mypage/festival/appliedlabor/${fest.festivalId}`)}>
                단기근로자 지원현황
              </button>
            </RecruitStatus>
          </FestCard>
        ))}
      </FestCardList>
    </FestivalClosed>
    </Box>
  );
};

export default MPFestivalClosed;

const FestivalClosed = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 0;
  box-sizing: border-box;
`;

const Fixed = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* background-color: white;  */
  z-index: 1000; 
`;

const Title = styled.div`
  background: #FEA898;
  font-size: 20px;
  font-weight: 800;
  padding: 10px 0 10px 270px;
`;

const FestCardList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 60px;
`;

const FestCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  width: 80%;
  max-width: 1000px;
`;

const FestImage = styled.img`
  width: 210px;
  height: 280px;
  object-fit: cover;
  border-radius: 20px;
  cursor: pointer;
`;

const FestInfo = styled.div`
  p{
    font-size: 14px;
  }
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  flex: 1;
`;

const FestName = styled.span`
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
`;

const RecruitStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  button {
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #F4EDED;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
        cursor: pointer;
      }
`;

import React from 'react';
import styled from 'styled-components';
import fest_data from '../../assets/fest/fest_data';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const MPFestivalOngoing = () => {
  const navigate = useNavigate();

  return (
    <FestivalOngoing>
      <Fixed>
      <Navbar />
      <Title>
        <p>진행 및 예정 행사</p>
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
    </FestivalOngoing>
  );
};

export default MPFestivalOngoing;


const FestivalOngoing = styled.div`
padding: 150px;
`;

const Fixed = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white; 
  z-index: 1000; 
`;

const Title = styled.div`
  background-color: rgb(199, 199, 199);
  font-size: 22px;
  padding: 30px 0 30px 270px;
`;

const FestCardList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
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
    width: 270px;
  height: 360px;
  border-radius: 20px;
  cursor: pointer;
`;

const FestInfo = styled.div`
  p{
    font-size: 18px;
  }
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  flex: 1;
`;

const FestName = styled.span`
  font-size: 25px;
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
    cursor: pointer;
  }
`;

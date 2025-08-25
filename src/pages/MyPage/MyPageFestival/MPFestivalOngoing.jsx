import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import fest_data from '../../../assets/fest/fest_data';
import Navbar from '../../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Box from '../../../components/Box';

const MPFestivalOngoing = () => {
  const navigate = useNavigate();

  

  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const viewMyFest = async() => {
    try{
      setLoading(true);
      setError("");

      const response = await fetch(
   "https://festival-everyday.duckdns.org/users/me/festivals?holdStatus=ONGOING&page=0&size=",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
  }
);



      const result = await response.json();

      if(!response.ok || result.success !== true) {
        throw new Error(result?.message || "내 축제 조회에 실패했습니다.");
      }
      
      setFestivals(result.data.content ?? []);
      console.log(result.data.content);
    }catch(error){
      console.error("Error fetching festivals:", error);
      setError(error.message);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    viewMyFest();
  },[]);

  if (loading) return <p style={{ padding: "150px" }}>불러오는 중...</p>;
  if (error) return <p style={{ padding: "150px", color: "red" }}>{error}</p>;

  return (
    <Box>
    <FestivalOngoing>
      <Fixed>
      <Navbar />
      <Title>
        <p>진행 및 예정 행사</p>
      </Title>
      </Fixed>


      {/* <FestCardList> */}
      <FestCardList>
        {festivals.length === 0 ? (
          <p>현재 진행 중이거나 예정된 행사가 없어요!</p>
        ) : (
          festivals.map((fest) => (
            <FestCard key={fest.id}>
              <FestImage onClick={()=>navigate(`/festivals/${fest.id}`)}src={fest.imageUrl ?? "/default.png"} alt={fest.name} />
              <FestInfo>
                <FestName onClick={()=>navigate(`/festivals/${fest.id}`)}>{fest.name}</FestName>
                <p>
                  {fest.address?.city} {fest.address?.district} 
                </p>
                <p>
                  {new Date(fest.period.begin).toLocaleDateString("ko-KR")} ~{" "}
                  {new Date(fest.period.end).toLocaleDateString("ko-KR")}
                </p>
              </FestInfo>

              <RecruitStatus>
                <button onClick={() => navigate(`/mypage/festival/ongoing/appliedcompany/${fest.id}`)}>
                  업체 지원현황
                </button>
                <button onClick={() => navigate(`/mypage/festival/ongoing/appliedlabor/${fest.id}`)}>
                  단기근로자 지원현황
                </button>
              </RecruitStatus>
            </FestCard>
          ))
        )}
      </FestCardList>
        
        {/* {fest_data.map((fest, index) => ( 
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
      </FestCardList> */}
    </FestivalOngoing>
    </Box>
  );
  
};

export default MPFestivalOngoing;


const FestivalOngoing = styled.div`
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
  border-radius: 15px;
  cursor: pointer;
  @media (max-width: 1100px){
    width:150px;
    height:200px;
  }
  @media (max-width: 800px){
    width: 120px;
    height:160px;
  }
`;

const FestInfo = styled.div`
  p{
    font-size: 14px;
    @media (max-width: 1100px){
    font-size:11px;
  }
  @media (max-width: 900px){
    font-size:9px;
  }
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
  @media (max-width: 1100px){
    font-size: 14px;
  }
  @media (max-width: 800px){
    font-size: 10px;
  }
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
    transition: all 0.2s ease;
      &:hover{
      background-color: #dcd7d7;
    }
    @media (max-width: 1100px){
    width: 100px;
    font-size:10px;
  }
  @media (max-width: 800px){
    width: 80px;
  }
    
  }
      
`;

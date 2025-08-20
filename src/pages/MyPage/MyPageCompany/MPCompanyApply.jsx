import React, { useState } from 'react'
import styled from 'styled-components'
import Navbar from '../../../components/Navbar'
import fest_data from '../../../assets/fest/fest_data'
import Modal from '../../../components/Modal'
import more_button from '../../../assets/more_button.png'

const MPFestivalFavored = () => {

  const [viewAllOngoingFest, setViewAllOngoingFest] = useState(false);
  const [viewAllClosedFest, setViewAllClosedFest] = useState(false);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageWrapper>
      <Fixed>
        <Navbar />
        <Title>
          <p>지원현황</p>
        </Title>
      </Fixed>


      <Content>
        {(viewAllOngoingFest ? (
            <>
              <OngoingFest>
                <Back onClick={()=>{
                setViewAllClosedFest(false);
                setViewAllOngoingFest(false);
                scrollToTop();
                }}>이전 페이지로</Back>
                <p>진행 및 예정인 행사</p>
                <FestCardList>
                  {fest_data.map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <FestName>{fest.festivalName}</FestName>
                            <p>{fest.location}</p>
                            <p>{fest.period}</p>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      <MoreIcon src={more_button} alt="업체더보기" />
                     </FestLeft>
                     
                    <Status>
                        <p>심사 중</p>
                    </Status>
                    
                    </FestCard>
                  ))}
                </FestCardList>
              </OngoingFest>
            </>
          ) : viewAllClosedFest ? (
            <>
              <ClosedFest>
                <Back onClick={()=>{
                setViewAllClosedFest(false);
                setViewAllOngoingFest(false);
                scrollToTop();
                }}>이전 페이지로</Back>
                <p>종료된 행사</p>
                <FestCardList>
                  {fest_data.map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <FestName>{fest.festivalName}</FestName>
                            <p>{fest.location}</p>
                            <p>{fest.period}</p>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      <MoreIcon src={more_button} alt="더보기" />
                     </FestLeft>
                     <Status>
                        <p>심사 중</p>
                    </Status>
                     
                    </FestCard>
                  ))}
                </FestCardList>
              </ClosedFest>
            </>
          ) : (
            <>
              <OngoingFest>
                <p>진행 및 예정인 행사</p>
                <FestCardList>
                  {fest_data.slice(0, 2).map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <FestName>{fest.festivalName}</FestName>
                            <p>{fest.location}</p>
                            <p>{fest.period}</p>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      <MoreIcon src={more_button} alt="업체더보기" />
                     </FestLeft>
                     <Status>
                        <p>심사 중</p>
                    </Status>
                    </FestCard>
                  ))}
                </FestCardList>
                <More
                  onClick={() => {
                    setViewAllOngoingFest(true);
                    setViewAllClosedFest(false);
                    scrollToTop();
                  }}
                >
                  더 보러가기
                </More>
              </OngoingFest>

              <ClosedFest>
                <p>종료된 행사</p>
                <FestCardList>
                  {fest_data.slice(2, 4).map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <FestName>{fest.festivalName}</FestName>
                            <p>{fest.location}</p>
                            <p>{fest.period}</p>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      <MoreIcon src={more_button} alt="업체더보기" />
                     </FestLeft>
                     <Status>
                        <p>심사 중</p>
                    </Status>
                    </FestCard>
                  ))}
                </FestCardList>
                <More
                  onClick={() => {
                    setViewAllClosedFest(true);
                    setViewAllOngoingFest(false);
                    scrollToTop();
                  }}
                >
                  더 보러가기
                </More>
              </ClosedFest>
            </>
          )
        ) 
    }
      </Content>
    </PageWrapper>
  );
};

export default MPFestivalFavored;


const PageWrapper = styled.div`
  padding: 170px;
`

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

const Back = styled.span`
  cursor: pointer;
  font-weight: bold;
  color: #555;
  text-decoration: underline;

  &:hover {
    color: #f97e6c;
  }
`

const OngoingFest = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`
const ClosedFest = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`

const FestCardList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  gap: 20px;
`;

const FestCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  width: 80%;
  max-width: 1000px;

    border: 1px solid #ddd;
    border-radius: 30px;
`;

const FestImage = styled.img`
  width: 270px;
  height: 360px;
  border-radius: 20px;
  cursor: pointer;
`;

const FestLeft = styled.div`
    display: flex;
    flex: 1;
    margin-left: 20px;
`
const Status = styled.div`
    
`

const FestInfo = styled.div`
  p{
    font-size: 18px;
  }
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`;

const FestName = styled.span`
  font-size: 25px;
  font-weight: 700;
  cursor: pointer;
`;

const ApplicationBtn = styled.button`
  /* display: inline-block; */
  margin-top: 100px;
  padding: 8px 12px;
  width: 150px;
  height: 50px;
  cursor: pointer;
`;



const Content = styled.div`
  border-top: 2px solid #ccc;
  padding: 50px;
  margin: -20px;
`;


const MoreIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const More = styled.span`
  align-self: flex-end;
  cursor: pointer;
  font-weight: bold;
  color: #555;
  text-decoration: underline;

  &:hover {
    color: #f97e6c;
  }
`



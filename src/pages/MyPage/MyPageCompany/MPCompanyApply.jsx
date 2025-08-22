import React, { useState } from 'react'
import styled from 'styled-components'
import Navbar from '../../../components/Navbar'
import fest_data from '../../../assets/fest/fest_data'
import Modal from '../../../components/Modal'
import more_button from '../../../assets/more_button.png'
import { useNavigate } from 'react-router-dom'
import Box from '../../../components/Box'

const MPCompanyApply = () => {

  const [viewAllOngoingFest, setViewAllOngoingFest] = useState(false);
  const [viewAllClosedFest, setViewAllClosedFest] = useState(false);


  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
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
                <Type>진행 및 예정인 행사</Type>
                <FestCardList>
                  {fest_data.map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <RealInfo>
                            <FestName>{fest.festivalName}</FestName>
                            <p>{fest.location}</p>
                            <p>{fest.period}</p>
                            </RealInfo>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      {/* <MoreIcon src={more_button} alt="업체더보기" /> */}
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
                <Type>종료된 행사</Type>
                <FestCardList>
                  {fest_data.map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <RealInfo>
                            <FestName>{fest.festivalName}</FestName>
                            <p>{fest.location}</p>
                            <p>{fest.period}</p>
                            </RealInfo>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      {/* <MoreIcon src={more_button} alt="더보기" /> */}
                     </FestLeft>
                     <StatusClosed>
                        <span>수락</span>
                        <ReviewBtn onClick={()=>navigate(`/mypage/company/${fest.festivalId}/review`)}>리뷰쓰기</ReviewBtn>
                    </StatusClosed>
                     
                    </FestCard>
                  ))}
                </FestCardList>
              </ClosedFest>
            </>
          ) : (
            <>
              <OngoingFest>
                <Type>진행 및 예정인 행사</Type>
                <FestCardList>
                  {fest_data.slice(0, 2).map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <RealInfo>
                            <FestName>{fest.festivalName}</FestName>
                            <p>{fest.location}</p>
                            <p>{fest.period}</p>
                            </RealInfo>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      {/* <MoreIcon src={more_button} alt="업체더보기" /> */}
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
                <Type>종료된 행사</Type>
                <FestCardList>
                  {fest_data.slice(2, 4).map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <RealInfo>
                            <FestName>{fest.festivalName}</FestName>
                            <p>{fest.location}</p>
                            <p>{fest.period}</p>
                            </RealInfo>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      {/* <MoreIcon src={more_button} alt="업체더보기" /> */}
                     </FestLeft>
                     <StatusClosed>
                        <span>수락</span>
                        <ReviewBtn onClick={()=>navigate(`/mypage/company/${fest.festivalId}/review`)}>리뷰쓰기</ReviewBtn>
                    </StatusClosed>
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
    </Box>
  );
};

export default MPCompanyApply;


const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 130px auto;
  box-sizing: border-box;
`

const Fixed = styled.div`
  position: fixed;  
  top: 0;
  left: 0;
  width: 100%;
  /* background-color: white;  */
  z-index: 1000; /* 다른 요소보다 위 */
`;

const Type = styled.div`
  font-size: 18px;
  font-weight: 400;
  margin: 0 8%;
`



const Title = styled.div`
  background: #FEA898;
  font-size: 20px;
  font-weight: 800;
  padding: 10px 0 10px 270px;
`;

const Back = styled.span`
  cursor: pointer;
  font-weight: bold;
  color: #555;
  text-decoration: underline;
  margin: 0 8%;
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
  margin-bottom: 20px;
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
  /* border-radius: 20px; */
  cursor: pointer;
`;

const FestLeft = styled.div`
  display: flex;
  flex: 1;
  margin-left: 20px;
`
const Status = styled.div`
    color: #6C53E8;
    
`
const StatusClosed = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
    
    span{
        color: #708A62;
    }
`

const ReviewBtn = styled.button`
    width: 130px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #F4EDED;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;

    &:hover{
      background-color: #dcd7d7;
    }
`;

const FestInfo = styled.div`
  p{
    font-size: 14px;
  }
  display: flex;
  flex-direction: column;
  gap: 150px;
  justify-content: center;
  flex:1;
`;

const RealInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const FestName = styled.span`
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
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



const Content = styled.div`
  /* padding: 50px; */
  /* margin: -20px; */
`;


// const MoreIcon = styled.img`
//   width: 24px;
//   height: 24px;
//   cursor: pointer;
// `;

const More = styled.span`
  margin-bottom: 80px;
  margin-right: 100px;
  margin-top: 20px;
  align-self: flex-end;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #555;
  text-decoration: underline;

  &:hover {
    color: #f97e6c;
  }
`



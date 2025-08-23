import React, { useState } from 'react'
import styled from 'styled-components'
import Navbar from '../../components/Navbar'
import fest_data from '../../assets/fest/fest_data'
import co_data from '../../assets/company/co_data'
import Modal from '../../components/Modal'
import more_button from '../../assets/more_button.png'
import Box from '../../components/Box'
import empty_star from '../../assets/empty_star.png'
import full_star from '../../assets/full_star.png'

const MPFestivalFavored = () => {

  // const [showModal, setShowModal] = useState(false);
  const [viewAllOngoingFest, setViewAllOngoingFest] = useState(false);
  const [viewAllClosedFest, setViewAllClosedFest] = useState(false);
  const [activeTab, setActiveTab] = useState('festival'); // 'festival' or 'company'
  const [favorStatus, setFavorStatus] = useState("FAVORED");

  // const handleUndo = () => {
  //   setShowModal(true);
  // };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <Box>
    <PageWrapper>
      <Fixed>
        <Navbar />
        <Title>
          <p>찜 목록</p>
        </Title>
      </Fixed>

      <FestOrCo>
        <TabButton
          active={activeTab === 'festival'}
          onClick={() => {
            setActiveTab('festival');
            setViewAllOngoingFest(false);
            setViewAllClosedFest(false);
          }}
        >
          축제
        </TabButton>
        <TabButton
          active={activeTab === 'company'}
          onClick={() => {
            setActiveTab('company');
            setViewAllOngoingFest(false);
            setViewAllClosedFest(false);
          }}
        >
          업체
        </TabButton>
      </FestOrCo>

      <Content>
        {activeTab === 'festival' ? (
          viewAllOngoingFest ? (
            <>
              <OngoingFest>
                {/* <Back onClick={()=>{
                setViewAllClosedFest(false);
                setViewAllOngoingFest(false);
                scrollToTop();
                }}>이전 페이지로</Back> */}
                <Type>진행 및 예정인 행사</Type>
                <FestCardList>
                  {fest_data.map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                      <FestInfo>
                        <FestName>{fest.festivalName}</FestName>
                        <p>{fest.location}</p>
                        <p>{fest.period}</p>
                      </FestInfo>
                      <FestFavored>
                        
                        {favorStatus===false? (
                          <>
                          <FavoredBtn src={empty_star} onClick={()=>setFavorStatus('FAVORED')}></FavoredBtn>
                          </>
                        ):(
                          <>
                          <FavoredBtn src={full_star} onClick={()=>setFavorStatus(false)}></FavoredBtn>
                        </>)}
                      </FestFavored>
                    </FestCard>
                  ))}
                </FestCardList>
              </OngoingFest>
            </>
          ) : viewAllClosedFest ? (
            <>
              <ClosedFest>
                {/* <Back onClick={()=>{
                setViewAllClosedFest(false);
                setViewAllOngoingFest(false);
                scrollToTop();
                }}>이전 페이지로</Back> */}
                <Type>종료된 행사</Type>
                <FestCardList>
                  {fest_data.map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.image} alt="" />
                      <FestInfo>
                        <FestName>{fest.festivalName}</FestName>
                        <p>{fest.location}</p>
                        <p>{fest.period}</p>
                      </FestInfo>
                      <FestFavored>
                        
                        {favorStatus===false? (
                          <>
                          <FavoredBtn src={empty_star} onClick={()=>setFavorStatus('FAVORED')}></FavoredBtn>
                          </>
                        ):(
                          <>
                          <FavoredBtn src={full_star} onClick={()=>setFavorStatus(false)}></FavoredBtn>
                        </>)}
                      </FestFavored>
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
                      <FestInfo>
                        <FestName>{fest.festivalName}</FestName>
                        <p>{fest.location}</p>
                        <p>{fest.period}</p>
                      </FestInfo>
                      <FestFavored>
                        
                        {favorStatus===false? (
                          <>
                          <FavoredBtn src={empty_star} onClick={()=>setFavorStatus('FAVORED')}></FavoredBtn>
                          </>
                        ):(
                          <>
                          <FavoredBtn src={full_star} onClick={()=>setFavorStatus(false)}></FavoredBtn>
                        </>)}
                      </FestFavored>
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
                      <FestInfo>
                        <FestName>{fest.festivalName}</FestName>
                        <p>{fest.location}</p>
                        <p>{fest.period}</p>
                      </FestInfo>
                      <FestFavored>
                        
                        {favorStatus===false? (
                          <>
                          <FavoredBtn src={empty_star} onClick={()=>setFavorStatus('FAVORED')}></FavoredBtn>
                          </>
                        ):(
                          <>
                          <FavoredBtn src={full_star} onClick={()=>setFavorStatus(false)}></FavoredBtn>
                        </>)}
                      </FestFavored>
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
        ) : (
          <>
            <Company>
              {co_data.map((co, index) => (
                <CoCard key={index}>
                  <CoImage src={co.image} alt="업체이미지" />
                  <Coleft>
                    <CoInfo>
                      <CoName>{co.companyName}</CoName>
                      <p>{co.address}</p>
                      <p>{co.companyCategory}</p>
                    </CoInfo>
                    <MoreIcon src={more_button} alt="업체더보기" />
                  </Coleft>
                  <FestFavored>
                        
                        {favorStatus===false? (
                          <>
                          <FavoredBtn src={empty_star} onClick={()=>setFavorStatus('FAVORED')}></FavoredBtn>
                          </>
                        ):(
                          <>
                          <FavoredBtn src={full_star} onClick={()=>setFavorStatus(false)}></FavoredBtn>
                        </>)}
                      </FestFavored>
                </CoCard>
              ))}
            </Company>
          </>
        )}
{/* 
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <p>찜 철회?</p>
        </Modal> */}
      </Content>
    </PageWrapper>
    </Box>
  );
};

export default MPFestivalFavored;


const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 130px auto;
  padding: 100px 0 0 0;
  box-sizing: border-box;
`

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

const Type = styled.div`
  font-size: 18px;
  font-weight: 400;
  margin: 0 8%;
`

// const Back = styled.span`
//   cursor: pointer;
//   font-weight: bold;
//   color: #555;
//   text-decoration: underline;

//   &:hover {
//     color: #f97e6c;
//   }
// `
const FestOrCo = styled.div`
  position: fixed;
  top: 124px;
  left: 300px;
  right: 200px;
  background-color: white;

  display: flex;
  gap: 10px;
  padding-top: 30px;
  margin-bottom: 20px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -300px;   /* 왼쪽 Sidebox 쪽으로 확장 */
    right: -200px;  /* 오른쪽 Sidebox 쪽으로 확장 */
    border-bottom: 2px solid #ccc;
    z-index: -1;    /* 탭 버튼 뒤로 */
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
  /* border-radius: 20px; */
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

const FestFavored = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;


`;

const FavoredBtn = styled.img`
    width: 30px;
    cursor: pointer;
`;


const TabButton = styled.button`
  padding: 10px 35px;
  border: none;
  border-radius: 12px 12px 0 0;
  background-color: ${({ active }) => (active ? '#f97e6c' : '#ffb3a7')};
  color: black;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ active }) => (active ? '#f97e6c' : '#ff9b8a')};
  }
`;



const Content = styled.div`
  padding: 1px;
  margin: -20px;
`;

const Company = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const CoCard = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  max-width: 1000px;
  gap: 20px;
  padding: 15px;
  /* border: 1px solid #ddd; */
  /* border-radius: 10px; */
`;

const CoImage = styled.img`
  width: 210px;
  height: 210px;
  /* border-radius: 10px; */
  object-fit: cover;
`;

const Coleft = styled.div`
  display: flex;
  flex: 1;
  margin-left: 20px;
`;
const CoInfo = styled.div`
  p{
    font-size: 14px;
  }
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  

`;


const CoName = styled.span`
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
`;


const MoreIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

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



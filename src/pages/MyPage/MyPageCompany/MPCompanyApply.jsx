import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Navbar from '../../../components/Navbar'
import fest_data from '../../../assets/fest/fest_data'
import Modal from '../../../components/Modal'
import more_button from '../../../assets/more_button.png'
import { useNavigate } from 'react-router-dom'
import Box from '../../../components/Box'

const MPCompanyApply = () => {

  const [activeFilter, setActiveFilter] = useState('지원순');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [viewAllOngoingFest, setViewAllOngoingFest] = useState(false);
  const [viewAllClosedFest, setViewAllClosedFest] = useState(false);
  
  const [festivals, setFestivals] = useState([]);
  const [festivalsEnd, setFestivalsEnd] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filters = ['지원순', '수락', '거절'];
  const [filteredFestivals, setFilteredFestivals] = useState([]);

      // appliedCompanies가 바뀌거나 activeFilter가 바뀔 때마다 필터링 실행
    useEffect(() => {
    switch (activeFilter) {
      case "지원순":
        setFilteredFestivals(festivalsEnd);
        break;
      case "수락":
        setFilteredFestivals(festivalsEnd.filter((f) => f.selected === "ACCEPTED"));
        break;
      case "거절":
        setFilteredFestivals(festivalsEnd.filter((f) => f.selected === "DENIED"));
        break;
      default:
        setFilteredFestivals(festivalsEnd);
    }
  }, [activeFilter, festivalsEnd]);

  // 유틸 함수
  const getOngoingStatus = (status) => {
    switch(status) {
      case "NEUTRAL": return "심사 중";
      case "ACCEPTED": return "수락";
      case "DENIED": return "거절";
      default: return "";
    }
  };

  const getEndedStatus = (status) => {
    switch(status) {
      case "NEUTRAL": return "심사 종료";
      case "ACCEPTED": return "수락";
      case "DENIED": return "거절";
      default: return "";
    }
  };

  // 상태별 색상 매핑
  const getStatusColor = (status, ended=false) => {
    if (!ended) { // 진행/예정된 경우
      switch(status) {
        case "NEUTRAL": return "#6C53E8"; // 파란색
        case "ACCEPTED": return "green";  // 초록색
        case "DENIED": return "red";      // 빨강
        default: return "black";
      }
    } else { // 종료된 경우
      switch(status) {
        case "NEUTRAL": return "gray";   // 회색
        case "ACCEPTED": return "green";
        case "DENIED": return "red";
        default: return "black";
      }
    }
  };



  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //진행 중 행사 api
    const viewAppliedFestOngoing = async() => {
      try{
        setError("");
  
        const response = await fetch(
          "https://festival-everyday.duckdns.org/my-applications?status=&progress=ONGOING&page=&size=",
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
          throw new Error(result?.message || "지원한 축제 조회1에 실패했습니다.");
        }
        
        setFestivals(result.data.content ?? []);
        console.log(result.data.content);
          }catch(error){
            console.error("Error fetching festivals:", error);
            setError(error.message);
          }
        };
  
    //종료된 행사    
    const viewAppliedFestEnded = async() => {
          try{
            setError("");
  
            const response = await fetch(
              "https://festival-everyday.duckdns.org/my-applications?status=&progress=ENDED&page=&size=",
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
              throw new Error(result?.message || "지원한 축제 조회2에 실패했습니다.");
            }
            
            setFestivalsEnd(result.data.content ?? []);
            console.log(result.data.content);
              }catch(error){
                console.error("Error fetching festivals:", error);
                setError(error.message);
              }
            };
        
        
  
        useEffect(()=>{
          setLoading(true);
          Promise.all([viewAppliedFestOngoing(), viewAppliedFestEnded()]).finally(() =>
            setLoading(false)
        );
        },[]);
  
  
    if (loading) return <p style={{ padding: "150px" }}>불러오는 중...</p>;
    if (error) return <p style={{ padding: "150px", color: "red" }}>{error}</p>;

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
                  {festivals.length === 0? (
                    <p>지원한 행사(진행/예정)가 없어요!</p>
                  ) : (
                    festivals.map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.imageUrl} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <RealInfo>
                            <FestName>{fest.name}</FestName>
                            <p>{fest.holderName}</p>
                           
                            </RealInfo>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      {/* <MoreIcon src={more_button} alt="업체더보기" /> */}
                     </FestLeft>
                     
        
                        <Status color={getStatusColor(fest.selected, false)}>
                          {getOngoingStatus(fest.selected)}
                        </Status>
                  
                    
                    </FestCard>
                  ))
                  )}
                  
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
                          <FestCardList>
                  {filteredFestivals.length===0? (
                    <p>지원한 행사(종료)가 없어요!</p>
                  ) : (
                     filteredFestivals.map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.imageUrl} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <RealInfo>
                            <FestName>{fest.name}</FestName>
                            <p>{fest.holderName}</p>
                            </RealInfo>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      {/* <MoreIcon src={more_button} alt="더보기" /> */}
                     </FestLeft>
                     <StatusClosed color={getStatusColor(fest.selected, true)}>
                        {getEndedStatus(fest.selected)}
                        {fest.selected === "ACCEPTED" && (
                          <ReviewBtn onClick={() => navigate(`/mypage/company/${fest.festivalId}/review`)}>
                            리뷰쓰기
                          </ReviewBtn>
                        )}
                      </StatusClosed>
                     
                    </FestCard>
                  ))
                  )}
                 
                </FestCardList>
              </ClosedFest>
            </>
          ) : (
            <>
              <OngoingFest>
                <Type>진행 및 예정인 행사</Type>
                <FestCardList>
                  {festivals.length===0? (
                    <p>지원한 행사(진행/예정)가 없어요!</p>
                  ) : (
                    festivals.slice(0, 2).map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.imageUrl} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <RealInfo>
                            <FestName>{fest.name}</FestName>
                            <p>{fest.holderName}</p>
                            </RealInfo>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      {/* <MoreIcon src={more_button} alt="업체더보기" /> */}
                     </FestLeft>
                      <Status color={getStatusColor(fest.selected, false)}>
                          {getOngoingStatus(fest.selected)}
                      </Status>
                    </FestCard>
                  ))
                  )}
                  
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
                  {festivalsEnd.length===0? (
                      <p>지원한 행사(종료)가 없어요!</p>
                  ) : (
                    festivalsEnd.slice(0, 2).map((fest, index) => (
                    <FestCard key={index}>
                      <FestImage src={fest.imageUrl} alt="" />
                     <FestLeft>
                        <FestInfo>
                            <RealInfo>
                            <FestName>{fest.name}</FestName>
                            <p>{fest.holderName}</p>
                            </RealInfo>
                            <ApplicationBtn>지원서 보기</ApplicationBtn>
                        </FestInfo>
                      {/* <MoreIcon src={more_button} alt="업체더보기" /> */}
                     </FestLeft>
                     <StatusClosed color={getStatusColor(fest.selected, true)}>
                        {getEndedStatus(fest.selected)}
                        {fest.selected === "ACCEPTED" && (
                          <ReviewBtn onClick={() => navigate(`/mypage/company/${fest.festivalId}/review`)}>
                            리뷰쓰기
                          </ReviewBtn>
                        )}
                      </StatusClosed>
                    </FestCard>
                  ))
                  )}
                  
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
  transition: all 0.2s ease;
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
    color: ${(props) => props.color || "black"};
    font-size: 18px;
    
    
`
const StatusClosed = styled.div`
    font-size: 18px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
    color: ${(props) => props.color || "black"};
`

const ReviewBtn = styled.button`
    width: 150px;
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
    transition: all 0.2s ease;

    &:hover{
      background-color: #dcd7d7;
    }

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


const ChoiceBtnY = styled.button`
    width: 150px;
    padding: 20px 0;
    border-radius: 20px;
    border:none;
    background: #BAE4A4;
    

    color: black;
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
  transition: all 0.2s ease;

  &:hover {
    color: #f97e6c;
  }
`



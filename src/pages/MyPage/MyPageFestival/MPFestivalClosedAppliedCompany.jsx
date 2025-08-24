import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../../components/Navbar';
// import fest_data from '../../../assets/fest/fest_data';
// import co_data from '../../../assets/company/co_data';
import more_button from '../../../assets/more_button.png'
import { useNavigate, useParams } from 'react-router-dom';
import Box from '../../../components/Box';
import Modal from '../../../components/Modal';

const MPFestivalClosedAppliedCompany = () => {
  const [activeFilter, setActiveFilter] = useState('지원순');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  //업체 지원현황 api 
	const [appliedCompanies, setAppliedCompanies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

  const filters = ['지원순', '수락', '거절'];
  const [filteredCompanies, setFilteredCompanies] = useState([]);

    // appliedCompanies가 바뀌거나 activeFilter가 바뀔 때마다 필터링 실행
  useEffect(() => {
  switch (activeFilter) {
    case "지원순":
      setFilteredCompanies(appliedCompanies);
      break;
    case "수락":
      setFilteredCompanies(appliedCompanies.filter((co) => co.selected === "ACCEPTED"));
      break;
    case "거절":
      setFilteredCompanies(appliedCompanies.filter((co) => co.selected === "DENIED"));
      break;
    default:
      setFilteredCompanies(appliedCompanies);
  }
}, [activeFilter, appliedCompanies]);



  // const festival = fest_data.find(f => f.festivalId === Number(festivalId));
  // const [companyList, setCompanyList] = useState(co_data);

  const {festivalId} = useParams();
  const [festivalInfo, setFestivalInfo] = useState(null); // 축제 정보
  
  

  const navigate = useNavigate();
  
  

  //모달팝업
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); //{id, status}
  
  // const openModal = (companyId, statusType) => {
  //   setPendingAction({id: companyId, status: statusType});
  //   setShowModal(true);
  // }
  const confirmModal = () => {
    if(pendingAction) {
      handleChoice(pendingAction.id, pendingAction.status);
    }
    setShowModal(false);
    setPendingAction(null);
  }
	
  //api
	const viewAppliedCompanies = async() => {
	  try{
	    setError("");
	
	    const response = await fetch(
				`https://festival-everyday.duckdns.org/festivals/${festivalId}/company-applications` ,
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
	      throw new Error(result.message || "업체 지원현황 조회에 실패했습니다.");
	    }
	    
	    setAppliedCompanies(result.data.content ?? []);
	    console.log(result.data.content);
	  }catch(error){
	    console.error("Error fetching applied companies:", error);
	    setError(error.message);
		}
	};

  //축제이름 찾기 api 시작
	const viewFestivalInfo = async () => {
      try {
        const response = await fetch(
          `https://festival-everyday.duckdns.org/users/me/festivals?holdStatus=ENDED&page=0&size=5`,
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
    Promise.all([viewAppliedCompanies(), viewFestivalInfo()]).finally(() =>
      setLoading(false)
    );
  }, [festivalId]);
    // 드롭다운 외부 클릭 감지용 effect
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownOpen && !e.target.closest(".dropdown-container")) {
          setDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);
  

    const handleChoice = (companyId, newStatus) => {
    setAppliedCompanies(prev =>
      prev.map(co =>
        co.id === companyId ? { ...co, selected: newStatus } : co
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
          <p>업체 지원현황</p>
        </Title>
      </Fixed>

      <Name>
          <p>{festivalInfo?.name ?? "축제 이름 불러오는 중"}</p>
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
      </Name>


      
   

      {/* <ApplyCompanyList>
        {companyList.map((co, index) => (
          <CoCard key={index}>
            <CoImage src={co.image} alt="업체이미지" />
            <Coleft>
              <CoInfo>
                <RealInfo>
                  <CoName>{co.companyName}</CoName>
                  <p>{co.address}</p>
                  <p>{co.companyCategory}</p>
                </RealInfo>
                <ApplicationBtn>지원서 보기</ApplicationBtn>
              </CoInfo>
              <MoreIcon src={more_button} alt="업체더보기" />
            </Coleft>



            <CoChoice>
              {co.companySelected === null && (
                <>
                  <ChoiceBtnYes onClick={() => handleChoice(co.companyId, true)}>수락하기</ChoiceBtnYes>
                  <ChoiceBtnNo onClick={() => handleChoice(co.companyId, false)}>거절하기</ChoiceBtnNo>
                </>
              )}

              {co.companySelected === true && (
                <>
                  <ChoiceBtnY disabled>수락됨</ChoiceBtnY>
                  <ChoiceBtn onClick={()=>navigate(`/mypage/festival/appliedcompany/${festivalId}/${co.companyId}/review`)}>리뷰쓰기</ChoiceBtn>
                </>
              )}

              {co.companySelected === false && (
                <ChoiceBtnN disabled>거절됨</ChoiceBtnN>
              )}
            </CoChoice>
          </CoCard>
        ))}
      </ApplyCompanyList> */}
  <ApplyCompanyList>
  {filteredCompanies.length === 0 ? (   
    <p>해당 조건에 맞는 업체가 없어요!</p>
  ) : (
    filteredCompanies.map((co) => (    
      <CoCard key={co.simpleCompany.id}>
        <CoImage src={co.imageUrl} alt="업체이미지" />
        <Coleft>
          <CoInfo>
            <RealInfo>
              <CoName>{co.simpleCompany.name}</CoName>
              <AddressWrapper>
                <p>{co.simpleCompany?.address?.city}</p>
                <p>{co.simpleCompany?.address?.district}</p>
              </AddressWrapper>
              <p>{co.simpleCompany.category}</p>
            </RealInfo>
            <ApplicationBtn>지원서 보기</ApplicationBtn>
          </CoInfo>
          <MoreIcon src={more_button} alt="업체더보기" />
        </Coleft>

        <CoChoice>
          {co.selected === "NEUTRAL" && (
            <>
              <ChoiceBtnYes disabled>수락하기</ChoiceBtnYes>
              <ChoiceBtnNo disabled>거절하기</ChoiceBtnNo>
            </>
          )}

          {co.selected === "ACCEPTED" && (
            <>
              <ChoiceBtnY disabled>수락됨</ChoiceBtnY>
              <ReviewBtn
                onClick={() =>
                  navigate(`/mypage/festival/appliedcompany/${festivalId}/${co.simpleCompany?.id}/review`)
                }
              >
                리뷰쓰기
              </ReviewBtn>
            </>
          )}

          {co.selected === "DENIED" && <ChoiceBtnN disabled>거절됨</ChoiceBtnN>}
        </CoChoice>
      </CoCard>
    ))
  )}
</ApplyCompanyList>

    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={confirmModal}
      type="cancel"
    >
      <p>
        {pendingAction?.status === "ACCEPTED"
          ? "해당 업체를 수락하시겠습니까?"
          : "해당 업체를 거절하시겠습니까?"}
      </p>
    </Modal>


    </PageWrapper>
    </Box>
  );
};

export default MPFestivalClosedAppliedCompany;

/* styled-components */
const PageWrapper = styled.div`
  padding-top: 180px;  
`;

const Fixed = styled.div`
  position: fixed;  
  top: 0;
  left: 0;
  width: 100%;
  /* background-color: white;  */
  z-index: 1000; /* 다른 요소보다 위 */
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
  padding: 10px 100px;
  z-index: 500; 
  border-bottom: 2px solid #eee; /* 깔끔한 구분선 optional */
`;



const Title = styled.div`
  background: #FEA898;
  font-size: 20px;
  font-weight: 800;
  padding: 10px 0 10px 270px;
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

const ApplyCompanyList = styled.div`
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
  border: 1px solid #ddd;
  border-radius: 10px;
`;

const CoImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 10px;
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
  gap: 160px;
  

`;

const AddressWrapper = styled.div`
  display: flex;
  gap: 3px;
`

const RealInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  
`

const CoName = styled.span`
  font-weight: 700;
  font-size: 20px;
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

const MoreIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const CoChoice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;


`;

const ReviewBtn = styled.button`
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
`;

const ChoiceBtnYes = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #F4EDED;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
`;


const ChoiceBtnNo = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.25);
    background: #F4EDED;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
`;

const ChoiceBtnY = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border:none;

    background: #BAE4A4;
    

    color: black;
`;

const ChoiceBtnN = styled.button`
    width: 200px;
    padding: 20px 0;
    border-radius: 20px;
    border:none;
 
    background: #CD7D6D;


    color: black;

`;

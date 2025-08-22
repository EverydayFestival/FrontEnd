import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../../components/Navbar';
import fest_data from '../../../assets/fest/fest_data';
import co_data from '../../../assets/company/co_data';
import more_button from '../../../assets/more_button.png'
import { useNavigate, useParams } from 'react-router-dom';
import Box from '../../../components/Box';

const MPFestivalAppliedCompany = () => {
  const [activeFilter, setActiveFilter] = useState('선착순');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filters = ['선착순', '리뷰 많은 순', '선정 많이 된 순'];

  const {festivalId} = useParams();
  const festival = fest_data.find(f => f.festivalId === Number(festivalId));
  const [companyList, setCompanyList] = useState(co_data);
  const handleChoice = (companyId, choice) => {
    setCompanyList(prev =>
      prev.map(co =>
        co.companyId === companyId ? { ...co, companySelected: choice } : co
      )
    );
  };
  const navigate = useNavigate();
  
  // const [companyList, setCompanyList] = useState([]);

  // useEffect(() => {
  //   // API 호출 시 festId 사용
  //   fetch(`/api/festival/${festivalId}/companies`)
  //     .then(res => res.json())
  //     .then(data => setCompanyList(data));
  // }, [festivalId]);

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
             <p>{festival?.festivalName}</p>
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


      
   

      <ApplyCompanyList>
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
      </ApplyCompanyList>
    </PageWrapper>
    </Box>
  );
};

export default MPFestivalAppliedCompany;

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
  z-index: 1000; 
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

const Dropdown = styled.div`
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

const ChoiceBtn = styled.button`
    width: 200px;
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

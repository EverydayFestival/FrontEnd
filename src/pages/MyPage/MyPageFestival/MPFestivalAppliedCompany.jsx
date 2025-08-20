import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../../components/Navbar';
import fest_data from '../../../assets/fest/fest_data';
import co_data from '../../../assets/company/co_data';
import more_button from '../../../assets/more_button.png'
import { useNavigate, useParams } from 'react-router-dom';

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
    <PageWrapper>
      <Fixed>
        <Navbar />
        <Title>
          <p>업체 지원현황</p>
        </Title>
      </Fixed>


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
      
      <p>{festival?.festivalName}</p>

      <ApplyCompanyList>
        {companyList.map((co, index) => (
          <CoCard key={index}>
            <CoImage src={co.image} alt="업체이미지" />
            <Coleft>
              <CoInfo>
                <CoName>{co.companyName}</CoName>
                <p>{co.address}</p>
                <p>{co.companyCategory}</p>
                <ApplicationBtn>지원서 보기</ApplicationBtn>
              </CoInfo>
              <MoreIcon src={more_button} alt="업체더보기" />
            </Coleft>



            <CoChoice>
              {co.companySelected === null && (
                <>
                  <ChoiceBtn onClick={() => handleChoice(co.companyId, true)}>수락하기</ChoiceBtn>
                  <ChoiceBtn onClick={() => handleChoice(co.companyId, false)}>거절하기</ChoiceBtn>
                </>
              )}

              {co.companySelected === true && (
                <>
                  <ChoiceBtn disabled>수락됨</ChoiceBtn>
                  <ChoiceBtn onClick={()=>navigate(`/mypage/festival/appliedcompany/${festivalId}/${co.companyId}/review`)}>리뷰쓰기</ChoiceBtn>
                </>
              )}

              {co.companySelected === false && (
                <ChoiceBtn disabled>거절됨</ChoiceBtn>
              )}
            </CoChoice>
          </CoCard>
        ))}
      </ApplyCompanyList>
    </PageWrapper>
  );
};

export default MPFestivalAppliedCompany;

/* styled-components */
const PageWrapper = styled.div`
  padding-top: 170px;  
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

const FilterSection = styled.div`
  display: flex;
  justify-content: right;
  padding-right: 260px;
  margin: 20px 0;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownBtn = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 150px;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10;
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
    font-size: 18px;
  }
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  

`;


const CoName = styled.span`
  font-weight: 700;
  font-size: 22px;
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
    cursor: pointer;
`;


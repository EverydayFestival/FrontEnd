import React, { useState } from 'react'
import styled from 'styled-components'
import Navbar from '../../components/Navbar'
import co_data from '../../assets/company/co_data'
import more_button from '../../assets/more_button.png'
import Modal from '../../components/Modal'

const MPFestivalInterest2Company = () => {

    const [showModal, setShowModal] = useState(false);
    
    const handleUndo = () => {
        setShowModal(true); // 등록 버튼 누르면 모달 열림
    };

    return (
        <PageWrapper>
            <Fixed>
                <Navbar />
                <Title>
                    <p>내가 관심을 표한 업체</p>
                </Title>
            </Fixed>

            <InterestList>
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
            
            
            
                        <CoInterest>
                            <InterestBtn onClick={handleUndo}>관심</InterestBtn>
                            
                                    
                        </CoInterest>
                    </CoCard>
                    ))}
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <p>관심 철회?</p>
                </Modal>
                </InterestList>



        </PageWrapper>
  )
}

export default MPFestivalInterest2Company

const PageWrapper = styled.div`
padding: 200px;
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

const InterestList = styled.div`
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

const MoreIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const CoInterest = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;


`;

const InterestBtn = styled.button`
    width: 200px;
    padding: 20px 0;
    cursor: pointer;
`;
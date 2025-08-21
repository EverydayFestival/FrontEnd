import React, { useState } from 'react'
import styled from 'styled-components'
import Navbar from '../../../components/Navbar'
import { useParams } from 'react-router-dom'
import fest_data from '../../../assets/fest/fest_data'
import Modal from '../../../components/Modal'

const MPLaborReview2Festival = () => {

    const {festivalId, companyId} = useParams();
    const festival = fest_data.find(f => f.festivalId === Number(festivalId));
    // const company = co_data.find(c => c.companyId === Number(companyId));    
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = () => {
        setShowModal(true); // 등록 버튼 누르면 모달 열림
    };



    return (
        <PageWrapper>
            <Fixed>
                <Navbar />
                <Title>
                    <p>리뷰 쓰기</p>
                </Title>
            </Fixed>
            <p>{festival?.festivalName}</p>

            <FestivalInfo>
                <img src={festival?.image} alt="" />
                <p>{festival?.festivalName}</p>
                <p>{festival?.location}</p>
                <p>{festival?.period}</p>
            </FestivalInfo>
            <Review>
                <p>리뷰를 작성해주세요(200자이내)</p>
                <input type="text" />
                <button onClick={handleSubmit}>등록하기</button>

                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <p>등록이 완료되었습니다!</p>
                </Modal>
            </Review>




        </PageWrapper>
  )
}

export default MPLaborReview2Festival

const PageWrapper = styled.div`
padding: 180px;
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

const FestivalInfo = styled.div`
    img{
        width: 270px;
        height: 360px;
    }
`;

const Review = styled.div`
    
`;
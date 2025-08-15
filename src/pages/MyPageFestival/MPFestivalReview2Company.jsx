import React from 'react'
import styled from 'styled-components'
import Navbar from '../../components/Navbar'
import { useParams } from 'react-router-dom'

const MPFestivalReview2Company = () => {

    const {festivalId, companyId} = useParams();



    return (
        <PageWrapper>
            <Fixed>
                <Navbar />
                <Title>
                    <p>리뷰 쓰기</p>
                </Title>
            </Fixed>
            <p>festivalId:{festivalId}companyId:{companyId}</p>



        </PageWrapper>
  )
}

export default MPFestivalReview2Company

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

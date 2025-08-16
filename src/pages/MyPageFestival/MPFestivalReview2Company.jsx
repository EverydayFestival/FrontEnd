import React from 'react'
import styled from 'styled-components'
import Navbar from '../../components/Navbar'
import { useParams } from 'react-router-dom'
import fest_data from '../../assets/fest/fest_data'
import co_data from '../../assets/company/co_data'

const MPFestivalReview2Company = () => {

    const {festivalId, companyId} = useParams();
    const festival = fest_data.find(f => f.festivalId === Number(festivalId));
    const company = co_data.find(c => c.companyId === Number(companyId));



    return (
        <PageWrapper>
            <Fixed>
                <Navbar />
                <Title>
                    <p>리뷰 쓰기</p>
                </Title>
            </Fixed>
            <p>{festival?.festivalName}</p>

            <CompanyInfo>
                <img src={company?.image} alt="" />
                <p>{company?.companyName}</p>
                <p>{company?.address}</p>
                <p>{company?.companyCategory}</p>
            </CompanyInfo>
            <Review>
                <p>리뷰를 작성해주세요(200자이내)</p>
                <input type="text" />
                <button>등록하기</button>
            </Review>




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

const CompanyInfo = styled.div`
    
`;

const Review = styled.div`
    
`;
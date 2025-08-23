import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Navbar from '../../../components/Navbar'
import { useParams } from 'react-router-dom'
import fest_data from '../../../assets/fest/fest_data'
import co_data from '../../../assets/company/co_data'
import Modal from '../../../components/Modal'
import Box from '../../../components/Box'

const MPFestivalReview2Company = () => {

    const {festivalId, companyId} = useParams();
    const festival = fest_data.find(f => f.festivalId === Number(festivalId));
    const company = co_data.find(c => c.companyId === Number(companyId));

    //리뷰대상(업체)정보
 	// const [companyInfo, setCompanyInfo] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState("");
    
    //리뷰 등록하기
    // const [content, setContent] = useState("");
    // const [disabled, setDisabled] = useState(true);
    // const onChangeContent = (e) => {
    //     setContent(e.target.value);
    // };
    
    //등록하기 모달팝업
    const [showModal, setShowModal] = useState(false);
    // const confirmModal = () => {
    //     //onSubmit
    // }

    const openModal = () => {
        setShowModal(true);
    }
    
    
    // //리뷰대상 정보 api
    // const viewCompanyInfo = async() => {
    //     try{
    //     setLoading(true);
    //     setError("");

    //     const response = await fetch(
    // `http://43.201.6.192:8080/companies/${companyId}/reviews/form`,
    // {
    //     method: "GET",
    //     headers: {
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //     Accept: "application/json",
    //     },
    // }
    // );

    //     const result = await response.json();

    //     if(!response.ok || result.success !== true) {
    //         throw new Error(result?.message || "업체 리뷰 정보를 불러오는 데 실패했습니다.");
    //     }
        
    //     setCompanyInfo(result.data ?? []);
    //     console.log(result.data);
    //     }catch(error){
    //     console.error("Error fetching company info:", error);
    //     setError(error.message);
    //     }finally{
    //     setLoading(false);
    //     }
    // };
    
    
    // useEffect(()=>{
    //     viewCompanyInfo();
    // },[]);


    // if (loading) return <p style={{ padding: "150px" }}>불러오는 중...</p>;
    // if (error) return <p style={{ padding: "150px", color: "red" }}>{error}</p>;



    return (
        <Box>
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
                <button onClick={openModal}>등록하기</button>

                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <p>등록이 완료되었습니다!</p>
                </Modal>
            </Review>
        </PageWrapper>
        </Box>
        // <Box>
        //     <PageWrapper>
        //         <Fixed>
        //             <Navbar />
        //             <Title>
        //                 <p>리뷰 쓰기</p>
        //             </Title>
        //         </Fixed>

        //         <CompanyInfo>
        //             <img src={companyInfo?.imageUrl ?? "/default.png"} alt="업체이미지" />
        //             <p>{companyInfo?.companyName}</p>
        //             <AddressWrapper>
        //                 <p>{companyInfo?.address.city}</p>
        //                 <p>{companyInfo?.address.district}</p>
        //         </AddressWrapper>
        //             <p>{companyInfo?.companyCategory}</p>
        //         </CompanyInfo>
        //         <Review>
        //             <p>리뷰를 작성해주세요(200자이내)</p>
        //             <input type="text" />
        //             <button onClick={openModal}>등록하기</button>
        //             <Modal
        //                 show={showModal}
        //                 onClose={() => setShowModal(false)}
        //                 onConfirm={confirmModal}
        //                 type="cancel"
        //                 >
        //                 <p>등록이 완료되었습니다!</p>
        //             </Modal>
        //         </Review>

        //     </PageWrapper>
        // </Box>
        
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
  /* background-color: white;  */
  z-index: 1000; 
`;

const Title = styled.div`
  background: #FEA898;
  font-size: 20px;
  font-weight: 800;
  padding: 10px 0 10px 270px;
`;

const AddressWrapper = styled.div`
  display: flex;
  gap: 10px;
`
const CompanyInfo = styled.div`
    img{
        width: 300px;
        height: 300px;
    }
`;

const Review = styled.div`
    
`;
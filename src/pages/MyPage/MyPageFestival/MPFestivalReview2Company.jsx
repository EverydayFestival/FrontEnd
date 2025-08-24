import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Navbar from '../../../components/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
// import fest_data from '../../../assets/fest/fest_data'
// import co_data from '../../../assets/company/co_data'
import Modal from '../../../components/Modal'
import Box from '../../../components/Box'

const MPFestivalReview2Company = () => {

    const {festivalId, companyId} = useParams();
    // const festival = fest_data.find(f => f.festivalId === Number(festivalId));
    // const company = co_data.find(c => c.companyId === Number(companyId));

    //리뷰대상(업체)정보
 	const [companyInfo, setCompanyInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    //리뷰 등록하기
    const [content, setContent] = useState("");
    
    //등록하기 모달팝업
    const [showModal, setShowModal] = useState(false);
    const confirmModal = () => {
        onSubmit();
    }

    // const openModal = () => {
    //     setShowModal(true);
    // }
    
    const navigate = useNavigate();
    
    //리뷰대상 정보 api
    const viewCompanyInfo = async() => {
        try{
        setLoading(true);
        setError("");

        const response = await fetch(
    `https://festival-everyday.duckdns.org/companies/${companyId}/reviews/form`,
    {
        method: "GET",
        headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json",
        },
    }
    );

        const result = await response.json();
        console.log("서버응답:",result);

        if(!response.ok || result.success !== true) {
            throw new Error(result?.message || "업체 리뷰 정보를 불러오는 데 실패했습니다.");
        }
        
        setCompanyInfo(result.data ?? []);
        console.log(result.data);
        }catch(error){
        console.error("Error fetching company info:", error);
        setError(error.message);
        }finally{
        setLoading(false);
        }
    };

    // 등록 로직만 따로 분리
    const handleRegister = async () => {
        // console.log("POST body:", {
        //     festivalId: Number(festivalId),
        //     content,
        // });
        console.log("제출되는 리뷰 내용:", content);
        console.log("POST body:", {
    festivalId: Number(festivalId),
    companyId: Number(companyId),
    content,
  });
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
            `https://festival-everyday.duckdns.org/companies/${companyId}/reviews`,
            {
                method: "POST",
                headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                festivalId: Number(festivalId),
                companyId: Number(companyId),
                content,
                }),
            }
            );

            const result = await response.json();

            if (!response.ok || result.success !== true) {
            throw new Error(result.message || "업체 리뷰 등록에 실패했습니다.");
            }

            setShowModal(true);

            
        } catch (error) {
            console.error("Error writing review:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    
     //form 전용 onSubmit (event가 있을 때만 preventDefault)
    const onSubmit = (e) => {
    if (e) e.preventDefault();
    handleRegister();
    };
    
    useEffect(()=>{
        if(companyId){
            viewCompanyInfo();
        }
    },[companyId]);


    if (loading) return <p style={{ padding: "150px" }}>불러오는 중...</p>;
    if (error) return <p style={{ padding: "150px", color: "red" }}>{error}</p>;



    return (
        // <Box>
        // <PageWrapper>
        //     <Fixed>
        //         <Navbar />
        //         <Title>
        //             <p>리뷰 쓰기</p>
        //         </Title>
        //     </Fixed>
        //     <p>{festival?.festivalName}</p>

        //     <CompanyInfo>
        //         <img src={company?.image} alt="" />
        //         <p>{company?.companyName}</p>
        //         <p>{company?.address}</p>
        //         <p>{company?.companyCategory}</p>
        //     </CompanyInfo>
        //     <Review>
        //         <p>리뷰를 작성해주세요(200자이내)</p>
        //         <input type="text" />
        //         <button onClick={openModal}>등록하기</button>

        //         <Modal show={showModal} onClose={() => setShowModal(false)}>
        //             <p>등록이 완료되었습니다!</p>
        //         </Modal>
        //     </Review>
        // </PageWrapper>
        // </Box>
        <Box>
            <PageWrapper>
                <Fixed>
                    <Navbar />
                    <Title>
                        <p>리뷰 쓰기</p>
                    </Title>
                </Fixed>
                <Content>
                <CompanyInfo>
                    <CompanyLeft>
                    <img src={companyInfo?.imageUrl ?? "/default.png"} alt="업체이미지" />
                    </CompanyLeft>
                    <CompanyRight>
                    <CompanyName>{companyInfo?.companyName}</CompanyName>
                    <RealInfo>
                    <AddressWrapper>
                        <p>{companyInfo?.address?.city}</p>
                        <p>{companyInfo?.address?.district}</p>
                    </AddressWrapper>
                    <p>{companyInfo?.companyCategory}</p>
                    </RealInfo>
                    </CompanyRight>
                </CompanyInfo>
                <Review>
                    <ReviewTop>
                    <ReviewPrompt>
                    <p>리뷰를 작성해주세요(200자이내)</p>
                    </ReviewPrompt>
                    <InputBox  as="textarea" 
                        value={content} 
                        onChange={(e) => {
                            const value = e.target.value;
                            if(value.length<=200){
                            setContent(value);
                        }
                             console.log("리뷰 입력값:", e.target.value); // 실시간 확인
                         }} />
                         <CharCount exceed={content.length > 200}>{content.length} / 200</CharCount>
                    </ReviewTop>
                        <RegisterBtn onClick={handleRegister} disabled={content.length > 200 || !content.trim()}>등록하기</RegisterBtn>
                    
                   

                </Review>

                </Content>
                     <Modal
                        show={showModal}
                        onClose={() => {
                            setShowModal(false);
                            navigate(`/mypage/festival/appliedcompany/${festivalId}`);
                        }}
                        onConfirm={confirmModal}
                        type="cancel"
                        >
                        <p>등록이 완료되었습니다!</p>
                    </Modal>

            </PageWrapper>
        </Box>
        
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

const CompanyLeft = styled.div`
    
`
const CompanyRight = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`
const CompanyName = styled.p`
    font-size: 18px;
    font-weight: 700;
`
const AddressWrapper = styled.div`
  display: flex;
  gap: 7px;
`
const CompanyInfo = styled.div`
    display: flex;
    gap: 50px;
    img{
        width: 300px;
        height: 300px;
    }
`;

const RealInfo = styled.div`
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`
const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 80px;
`
const ReviewTop = styled.div`
    display: flex;
    flex-direction: column;
    gap: 17px;
`
const Review = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
    align-items: center;
`;

const ReviewPrompt = styled.div`
    font-size: 16px;
    font-weight: 300;
`
const InputBox = styled.input`
    width: 750px;
    height: 200px;
    border-width: 1px;
    border: 1px solid #979797;
    border-radius: 20px;
    padding: 10px;
    font-size: 14px;
    resize: none;
    text-align: left;
    vertical-align: top;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.5;
`
const CharCount = styled.div`
    font-size: 14px;
    text-align: right;
    margin-top: 5px;
    color: ${(props) => (props.exceed ? "red" : "#666")}
`

const RegisterBtn = styled.button` 
    display: flex;
    width: 220px;
    height: 70px;
    padding: 20px 80px;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 10px;
    flex-shrink: 0;
    font-size: 16px;
    color: black;
    border:none;
    border-radius: 20px;
    background: ${(props) => (props.disabled ? "#8e8e8e" : "#FEA898")};
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover{
        background: ${(props) => (props.disabled ? "#8e8e8e" : "#ee9d8f")} ;
    }
`




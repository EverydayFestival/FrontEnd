import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Navbar from '../../../components/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import fest_data from '../../../assets/fest/fest_data'
import Modal from '../../../components/Modal'
import Box from '../../../components/Box'
const MPCompanyReview2Festival = () => {

    const {festivalId, companyId} = useParams();
    // const festival = fest_data.find(f => f.festivalId === Number(festivalId));
    // const company = co_data.find(c => c.companyId === Number(companyId));    

    const navigate = useNavigate();

    //리뷰대상(축제)정보
    	 
	const [festivalInfo, setFestivalInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    //리뷰 등록하기
    const [content, setContent] = useState("");
    
    //등록하기 모달팝업
    const [showModal, setShowModal] = useState(false);
    
    //리뷰대상 정보 api
    const viewFestivalInfo = async() => {
        try{
        setLoading(true);
        setError("");

            const response = await fetch(
        `https://festival-everyday.duckdns.org/festivals/${festivalId}/reviews/form`,
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
                throw new Error(result?.message || "축제 리뷰 정보를 불러오는 데 실패했습니다.");
            }
            
            setFestivalInfo(result.data ?? []);
            console.log(result.data);
            }catch(error){
            console.error("Error fetching festival info:", error);
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
                `https://festival-everyday.duckdns.org/festivals/${festivalId}/reviews`,
                {
                    method: "POST",
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    content,
                    }),
                }
                );

                const result = await response.json();

                if (!response.ok || result.success !== true) {
                throw new Error(result.message || "축제 리뷰 등록에 실패했습니다.");
                }

                setShowModal(true);

                
            } catch (error) {
                console.error("Error writing review:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        

        
        useEffect(()=>{
            if(festivalId){
                viewFestivalInfo();
            }
        },[festivalId]);


        if (loading) return <p style={{ padding: "150px" }}>불러오는 중...</p>;
        if (error) return <p style={{ padding: "150px", color: "red" }}>{error}</p>;





    return (
    //   <Box>
    //     <PageWrapper>
    //         <Fixed>
    //             <Navbar />
    //             <Title>
    //                 <p>리뷰 쓰기</p>
    //             </Title>
    //         </Fixed>
    //         <p>{festival?.festivalName}</p>

    //         <FestivalInfo>
    //             <img src={festival?.image} alt="" />
    //             <p>{festival?.festivalName}</p>
    //             <p>{festival?.location}</p>
    //             <p>{festival?.period}</p>
    //         </FestivalInfo>
    //         <Review> 
    //             <p>리뷰를 작성해주세요(200자이내)</p>
    //             <input type="text" />
    //             <button onClick={handleSubmit}>등록하기</button>

    //             <Modal show={showModal} onClose={() => setShowModal(false)}>
    //                 <p>등록이 완료되었습니다!</p>
    //             </Modal>
    //         </Review>




    //     </PageWrapper>
    //     </Box>

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
                    <img src={festivalInfo?.imageUrl ?? "/default.png"} alt="축제이미지" />
                    </CompanyLeft>
                    <CompanyRight>
                    <CompanyName>{festivalInfo?.festivalName}</CompanyName>
                    <RealInfo>
                    <AddressWrapper>
                        <p>{festivalInfo?.address?.city}</p>
                        <p>{festivalInfo?.address?.district}</p>
                    </AddressWrapper>
                    <p>
                        {new Date(festivalInfo?.period?.begin).toLocaleDateString("ko-KR")} ~{" "}
                        {new Date(festivalInfo?.period?.end).toLocaleDateString("ko-KR")}
                    </p>
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
                        type="cancel"
                        >
                        <p>등록이 완료되었습니다!</p>
                    </Modal>

            </PageWrapper>
        </Box>
  )
}

export default MPCompanyReview2Festival

const PageWrapper = styled.div`
  padding: 180px 20px;  /* 위아래 180px, 좌우 20px */
  max-width: 1200px;
  margin: 0 auto;  /* 가운데 정렬 */
  box-sizing: border-box; /* padding까지 포함 */
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
    margin-left: 130px;
`
const CompanyRight = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
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
        object-fit: cover; /* 크롭되더라도 비율 유지 */
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
const InputBox = styled.textarea`
    width: 750px;
    height: 200px;
    border: 1px solid #979797;
    border-radius: 20px;
    padding: 10px;
    font-size: 14px;
    resize: none;
    line-height: 1.5;
    box-sizing: border-box;
`;

const CharCount = styled.div`
    font-size: 14px;
    text-align: right;
    margin-top: 5px;
    color: ${(props) => (props.exceed ? "red" : "#666")};
`

const RegisterBtn = styled.button` 
    width: 100%;
    display: flex;
    max-width: 220px;
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
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover{
        background: ${(props) => (props.disabled ? "#8e8e8e" : "#ee9d8f")} ;
    }
`




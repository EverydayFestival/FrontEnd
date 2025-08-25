import React from "react";
import Header from "../components/Header";
import "../styles/Inquiry.css";
import Navbar from "../components/Navbar";
import styled from "styled-components";

function Inquiry() {
    return (
        <PageWrapper>
            <Navbar />
            <Header/>
            <Content>
            <Question>문의 사항이 있으신가요?</Question>
            <p>이용 중 궁금하신 사항이나 확인이 필요한 내용이 있으시다면, 언제든 관리자에게 문의하여 주시기 바랍니다. 성심껏 안내해 드리겠습니다.</p>
            </Content>
        </PageWrapper>
    );
}

export default Inquiry;

const PageWrapper = styled.div`
`;

const Question = styled.h2`
`;

const Content = styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
    justify-content: center;
    
`;
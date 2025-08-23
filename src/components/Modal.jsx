import React from 'react';
import styled from 'styled-components';



const Modal = ({ show, onClose, onConfirm, children, type = 'ok' }) => {
  if (!show) return null;

//  사용법: <Modal show={show} onClose={...}>원하는 내용</Modal>
// <Modal show={show} onClose={...} onCancel={...} type="cancel">내용</Modal>


  return (
    <ModalOverlay>
      <ModalContent>
        {children}
        <ButtonWrapper>
          {type === 'cancel'?  (
            <>
            <ModalButtonNo onClick={onClose}>취소</ModalButtonNo>
            <ModalButtonYes onClick={onConfirm || onClose}>확인</ModalButtonYes>
            </>
          ): <ModalButtonYess onClick={onConfirm || onClose}>확인</ModalButtonYess>}

        </ButtonWrapper>

      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const ModalContent = styled.div`
  background: white;
  width: 250px;
  height: 100px;
  margin: 30px 40px;
  padding-top: 40px;
  padding-bottom: 5px;
  border-radius: 10px;
  text-align: center;
  font-size: 15px;
`;

const ButtonWrapper = styled.div`
  padding-top: 30px;
  height: 90px;
  margin-bottom: 0;
  display: flex;
  width: 100%;
  /* border-top: 1px solid #ccc; */
`;

const ModalButtonNo = styled.button`
  flex:1;
  padding: 15px 0px;
  width: 50px;
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  border: none;
  border-radius: 0 0 0 10px;
  background-color: white;
  cursor: pointer;

  &:hover{
    background-color: #e4e0e0;
  }
  
  &:first-child{
    /* border-right: 1px solid #ccc; */
  }
  
`;

const ModalButtonYes = styled.button`
  flex:1;
  padding: 15px 0px;
  width: 50px;
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  border: none;
  border-radius: 0 0 10px 0;
  background-color: white;
  cursor: pointer;

  &:hover{
    background-color: #e4e0e0;
  }
  
  &:first-child{
    /* border-right: 1px solid #ccc; */
  }
  
`;


const ModalButtonYess = styled.button`
  flex:1;
  padding: 15px 0px;
  width: 50px;
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  border: none;
  border-radius: 0 0 10px 10px;
  background-color: white;
  cursor: pointer;

  &:hover{
    background-color: #e4e0e0;
  }
  
  &:first-child{
    /* border-right: 1px solid #ccc; */
  }
  
`;
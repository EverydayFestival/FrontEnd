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
          {type === 'cancel' && (
            <ModalButton onClick={onClose}>취소</ModalButton>
          )}
          <ModalButton onClick={onConfirm || onClose}>확인</ModalButton>
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
  padding: 20px 40px;
  border-radius: 10px;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;
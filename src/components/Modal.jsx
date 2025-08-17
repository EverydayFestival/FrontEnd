import React from 'react';
import styled from 'styled-components';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

//  사용법: <Modal show={show} onClose={...}>원하는 내용</Modal>


  return (
    <ModalOverlay>
      <ModalContent>
        {children}
        <button onClick={onClose}>확인</button>
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

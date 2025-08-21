import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import bell from '../assets/bell.png';
import mypageicon from '../assets/mypageicon.png';
import logout from '../assets/logout.png';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const Navbar = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const handleSubmit = () => {
      setShowModal(true); // 등록 버튼 누르면 모달 열림
  };

  return (
    <NavbarWrapper>
      <NavbarLeft>
        <Logo onClick={()=>navigate('/')}src={logo} alt="logo" />
      </NavbarLeft>
      <NavbarRight>
        <Icon onClick={()=>navigate('/mypage/festival/notification')}src={bell} alt="notification" />
        <Icon onClick={()=>navigate('/mypage/')}src={mypageicon} alt="mypage" />
        <Icon onClick={handleSubmit}src={logout} alt="logout" />
        <Modal show={showModal} onClose={() => setShowModal(false)} type="cancel">
            <p>로그아웃 하시겠습니까?</p>
        </Modal>
      </NavbarRight>
    </NavbarWrapper>
  );
};

export default Navbar;

/* styled-components */
const NavbarWrapper = styled.div`
  /* position: fixed; */
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 3%;
  box-sizing: border-box;
`;

const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
  cursor: pointer;
`;

const NavbarRight = styled.div`
  display: flex;
  gap: 16px;
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import bell from '../assets/bell.png';
import mypageicon from '../assets/mypageicon.png';
import logout_icon from '../assets/logout.png';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const handleSubmit = () => {
      setShowModal(true); // 등록 버튼 누르면 모달 열림
  };
    const { logout } = useContext(AuthContext);

  return (
    <NavbarWrapper>
      <NavbarLeft>
        <Logo onClick={()=>navigate('/')}src={logo} alt="logo" />
      </NavbarLeft>
      <Center></Center>
      <NavbarRight>
        <Icon onClick={()=>navigate('/mypage/festival/notification')}src={bell} alt="notification" />
        <Icon onClick={()=>navigate('/mypage/')}src={mypageicon} alt="mypage" />
        <Icon onClick={handleSubmit}src={logout_icon} alt="logout" />
        <Modal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onConfirm={logout}
        type="cancel">
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
  padding: 0px 2%;
  box-sizing: border-box;
`;

const Center = styled.div`
  width: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`


const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 80px;
  margin: 0 40px;
  cursor: pointer;
`;

const NavbarRight = styled.div`
  display: flex;
  gap: 16px;
`;

const Icon = styled.img`
  margin-top: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import bell from '../assets/bell.png';
import mypageicon from '../assets/mypageicon.png';
import logout from '../assets/logout.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <NavbarWrapper>
      <NavbarLeft>
        <Logo onClick={()=>navigate('/mypage')}src={logo} alt="logo" />
      </NavbarLeft>
      <NavbarRight>
        <Icon src={bell} alt="notification" />
        <Icon src={mypageicon} alt="mypage" />
        <Icon src={logout} alt="logout" />
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

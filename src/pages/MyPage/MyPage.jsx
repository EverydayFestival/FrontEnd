import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import profile from '../../assets/profile.png';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const [profileType, setProfileType] = useState('Company'); //Festival, Company, Labor
  const navigate = useNavigate();

  const buttonConfig = {
    Festival: [
      { label: "진행 및 예정 행사", path: '/mypage/festival/ongoing' },
      { label: "종료된 행사", path: '/mypage/festival/closed' },
      { label: "내가 관심을 표한 업체", path: '/mypage/festival/interest'},
      { label: "찜", path: '/mypage/favored?type=festival' }
    ],
    Company: [
      { label: "지원현황", path: '/mypage/company/apply' },
      { label: "찜", path: '/mypage/favored?type=company' }
    ],
    Labor: [
      { label: "지원현황" },
      { label: "찜" }
    ]
  };

  const buttons = buttonConfig[profileType] || [];

  return (
    <MyPageWrapper>
      <Navbar />
      <Profile>
        <ProfileImg src={profile} alt="profile image" />
        <ProfileInfo>
          <h2>멋사센터</h2>
          <p>축제 및 행사 주최자</p>
        </ProfileInfo>
      </Profile>

      <MyPageMenu>
        {buttons.map((btn, index) => (
          <MenuButton
            key={index}
            onClick={() => btn.path && navigate(btn.path)}
          >
            {btn.label}
          </MenuButton>
        ))}
      </MyPageMenu>
    </MyPageWrapper>
  );
};

export default MyPage;

/* styled-components */
const MyPageWrapper = styled.div``;

const Profile = styled.div`
  padding: 20px 300px;
  display: flex;
  align-items: center;
  gap: 80px;
`;

const ProfileImg = styled.img`
  width: 150px;
`;

const ProfileInfo = styled.div`
  h2 {
    margin: 0;
  }
  p {
    margin: 0;
    color: gray;
  }
`;

const MyPageMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  gap: 10px;
`;

const MenuButton = styled.button`
  width: 1022px;
  height: 101px;
  padding: 20px 0;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
`;

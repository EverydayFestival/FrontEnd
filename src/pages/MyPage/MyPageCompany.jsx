// import React, { useState } from 'react';
// import styled from 'styled-components';
// import Navbar from '../../components/Navbar';
// import profile from '../../assets/profile.png';
// import { useNavigate } from 'react-router-dom';

// const MyPage = () => {
//   const [profileType, setProfileType] = useState('Company'); //Festival, Company, Labor
//   const navigate = useNavigate();

//   const buttonConfig = {
//     Company: [
//       { label: "지원현황", path: '/mypage/company/apply' },
//       { label: "찜", path: '/mypage/favored?type=company' }
//     ]
//   };

//   const buttons = buttonConfig[profileType] || [];

//   return (
//     <MyPageWrapper>
//       <Navbar />
//       <Profile>
//         <ProfileImg src={profile} alt="profile image" />
//         <ProfileInfo>
//           <h2>배포의 민족</h2>
//           <p>업체 담당자</p>
//         </ProfileInfo>
//       </Profile>

//       <MyPageMenu>
//         {buttons.map((btn, index) => (
//           <MenuButton
//             key={index}
//             onClick={() => btn.path && navigate(btn.path)}
//           >
//             {btn.label}
//           </MenuButton>
//         ))}
//       </MyPageMenu>
//     </MyPageWrapper>
//   );
// };

// export default MyPage;

// /* styled-components */
// const MyPageWrapper = styled.div``;

// const Profile = styled.div`
//   padding: 20px 300px;
//   display: flex;
//   align-items: center;
//   gap: 80px;
// `;

// const ProfileImg = styled.img`
//   width: 100px;
// `;

// const ProfileInfo = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 5px;
//   h2 {
//     font-size: 20px;
//     margin: 0;
//   }
//   p {
//     font-size: 14px;
//     margin: 0;
//     color: gray;
//   }
// `;

// const MyPageMenu = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-top: 30px;
//   gap: 20px;
// `;

// const MenuButton = styled.button`
//   width: 700px;
//   height: 70px;
//   padding: 20px 20px;
//   font-size: 16px;
//   text-align: left;
//   font-weight: 300;
//   border: none;
//   border-radius: 20px;
//   background: #F4EDED;
//   box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
//   cursor: pointer;
//   transition: all 0.2s ease;


//     &:hover{
//     background-color: #dcd7d7;
//   }
// `;

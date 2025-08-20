import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../../../components/Navbar";
import { formatKoreanDate } from "../../../utils/dateFormat";

const MPFestivalNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // const fetchNotices = async () => {
    //   try {
    //     const res = await fetch("/users/me/notices", {
    //       method: "GET",
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //         "Content-Type": "application/json",
    //       },
    //     });

    //     if (!res.ok) {
    //       throw new Error(`HTTP error! status: ${res.status}`);
    //     }

    //     const data = await res.json();

    //     if (data.success) {
    //       setNotifications(data.data);
    //     } else {
    //       console.error("알림 조회 실패:", data.message);
    //     }
    //   } catch (err) {
    //     console.error("알림 조회 중 오류:", err);
    //   }
    // };

    // fetchNotices();
  // TODO: 나중에 API로 교체
  const mockNotices = [
    {
      type: "FESTIVAL_DEAD",
      festivalName: "한강불꽃축제",
      createdAt: "2025-08-26T04:00:00",
    },
    {
      type: "COMPANY_APPLIED",
      companyId: 42,
      festivalName: "서울푸드페스티벌",
      createdAt: "2025-08-25T20:30:00",
    },
    {
      type: "LABOR_APPLIED",
      laborId: 77,
      festivalName: "부산바다축제",
      createdAt: "2025-08-25T14:15:00",
    },
    {
      type: "APPLY_DECISION",
      festivalName: "전주비빔밥축제",
      decision: true,
      createdAt: "2025-08-25T11:00:00",
    },
  ];
  setNotifications(mockNotices);
}, []);


  const renderMessage = (noti) => {
    switch (noti.type) {
      case "FESTIVAL_DEAD":
        return `${noti.festivalName} 모집이 마감되었습니다.`;
      case "COMPANY_APPLIED":
        return `부스(ID: ${noti.companyId})가 ${noti.festivalName}에 지원했습니다.`;
      case "LABOR_APPLIED":
        return `근로자(ID: ${noti.laborId})가 ${noti.festivalName}에 지원했습니다.`;
      case "FESTIVAL_DUE":
        return `${noti.festivalName} 마감까지 ${noti.daysLeft}일 남았습니다.`;
      case "FESTIVAL_INTEREST":
        return `${noti.festivalName}이(가) 나에게 관심을 보냈습니다.`;
      case "APPLY_DECISION":
        return `${noti.festivalName}에서 나를 ${
          noti.decision ? "수락" : "거절"
        }했습니다.`;
      default:
        return "알 수 없는 알림입니다.";
    }
  };

  return (
    <PageContainer>
      <Fixed>
        <Navbar />
        <Title>
          <p>알림</p>
        </Title>
      </Fixed>
      {notifications.length === 0 ? (
        <EmptyMessage>새 알림이 없습니다.</EmptyMessage>
      ) : (
        <NotificationList>
          {notifications.map((noti, idx) => (
            <NotificationItem key={idx}>
              <Message>{renderMessage(noti)}</Message>
              <Time>{formatKoreanDate(noti.createdAt)}</Time>
            </NotificationItem>
          ))}
        </NotificationList>
      )}
    </PageContainer>
  );
};

export default MPFestivalNotification;

//
// Styled Components
//
const PageContainer = styled.div`
  padding: 200px;
  
`;

const Fixed = styled.div`
  position: fixed;  
  top: 0;
  left: 0;
  width: 100%;
  background-color: white; /* 투명 배경 방지 */
  z-index: 1000; /* 다른 요소보다 위 */
`;


const Title = styled.div`
  background-color: rgb(199, 199, 199);
  font-size: 22px;
  padding: 30px 0 30px 270px;
`;

const EmptyMessage = styled.p`
  color: #777;
  text-align: center;
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NotificationItem = styled.li`
  background: #f9f9f9;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
`;

const Message = styled.p`
  font-size: 16px;
  margin: 0 0 5px 0;
`;

const Time = styled.span`
  font-size: 12px;
  color: #999;
`;

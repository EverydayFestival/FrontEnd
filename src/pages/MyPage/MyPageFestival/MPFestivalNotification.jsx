import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../../../components/Navbar";
import { formatKoreanDate } from "../../../utils/dateFormat";
import Box from "../../../components/Box";
import { EventSourcePolyfill } from 'event-source-polyfill';

const MPFestivalNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const accessToken = localStorage.getItem("accessToken");

  // 기존 알림 불러오기
  const viewNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://festival-everyday.duckdns.org/users/me/notices",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result?.message || "내 알림 조회에 실패했습니다.");
      }

      // 실제 데이터 배열이 어디에 있는지 확인 필요 (여기선 result.data로 가정)
      setNotifications(result.data?.content ?? []);
      console.log("기존 알림:", result.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 실시간 구독 및 기존 알림 호출
  useEffect(() => {
    viewNotifications();

    if (!accessToken) {
      console.warn("accessToken이 없습니다.");
      return;
    }

    const eventSource = new EventSourcePolyfill(
      "https://festival-everyday.duckdns.org/notifications/subscribe",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    eventSource.addEventListener("connect", (event) => {
      console.log("실시간 알림 연결 성공:", event.data);
    });

    eventSource.addEventListener("newNotice", (event) => {
      const newNotice = JSON.parse(event.data);
      console.log("🔔 새 알림 도착!", newNotice);

      // 새 알림을 기존 목록 앞에 추가
      setNotifications((prev) => [newNotice, ...prev]);

      // UI 피드백용 (임시)
      showNotificationBanner(newNotice);
      incrementBellIcon();
    });

    eventSource.onerror = (err) => {
      console.error("EventSource 에러:", err);
    };

    return () => {
      console.log("실시간 연결 해제");
      eventSource.close();
    };
  }, []);

  // ✨ UI 피드백 placeholder 함수
  const showNotificationBanner = (notice) => {
    alert(`🔔 새 알림: ${renderMessage(notice)}`);
  };

  const incrementBellIcon = () => {
    // TODO: 종 아이콘 숫자 증가시키는 로직 연결
    console.log("🔔 종 아이콘 카운트 +1");
  };

  if (loading) return <p style={{ padding: "150px" }}>불러오는 중...</p>;
  if (error) return <p style={{ padding: "150px", color: "red" }}>{error}</p>;


  const renderMessage = (noti) => {
    switch (noti.noticeType) {
      case "FESTIVAL_DEAD":
        return `${noti.payload.festivalName} 모집이 마감되었습니다.`;
      case "COMPANY_APPLIED":
        return `${noti.payload.companyName}이(가) ${noti.payload.festivalName}에 지원했습니다.`;
      case "LABOR_APPLIED":
        return `${noti.payload.laborName}님이 ${noti.payload.festivalName}에 지원했습니다.`;
      case "FESTIVAL_DUE":
        return `${noti.payload.festivalName} 마감까지 ${noti.payload.daysLeft}일 남았습니다.`;
      case "FESTIVAL_INTEREST":
        return `${noti.payload.festivalName}이(가) 나에게 관심을 보냈습니다.`;
      case "APPLY_ACCEPTED":
        return `${noti.payload.festivalName}에서 나의 지원서가 수락되었습니다.`;
      case "APPLY_DENIED":
        return `${noti.payload.festivalName}에서 나의 지원서가 거절되었습니다.`;
      default:
        return "알 수 없는 알림입니다.";
    }
  };

  return (
    <Box>
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
    </Box>
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
  /* background-color: white;  */
  z-index: 1000; /* 다른 요소보다 위 */
`;

const Title = styled.div`
  background: #FEA898;
  font-size: 20px;
  font-weight: 800;
  padding: 10px 0 10px 270px;
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

import React from "react";
import { createContext, useState, useEffect } from "react";


//1. 인증 컨텍스트(저장소) 생성하기
export const AuthContext = createContext();

// 2. 컨텍스트 공급자(AuthProvider) 컴포넌트
// 이 컴포넌트가 앱 전체의 로그인 상태를 관리합니다.
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInitiallizing, setIsInitiallizing] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("loggedInUser");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
        }
    } catch (error) {
        console.error("저장된 사용자 정보를 불러오는 데 실패했습니다.", error);
        //오류 발생 시 로그아웃 처리
        localStorage.removeItem("loggedInUser");
    } finally {
        //2. localStorage 확인 작업이 끝나면 로딩 상태를 false로 변경합니다.
        setIsInitiallizing(false);
    }        
}, []);

    // 로그인 함수
    // 실제 API 연동 시, 이 함수 내부에서 fetch 요청을 보냅니다.
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
    };

// --- 토큰을 가져오기 위한 헬퍼 함수 (주석 해제) ---
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    // --- API 연동이 적용된 새로운 logout 함수 ---
    const logout = async () => {
        const token = getCookie("accessToken");

        // 클라이언트 측 세션 정리 함수
        const clearClientSession = () => {
            setUser(null);
            localStorage.removeItem("loggedInUser");
            // 쿠키 삭제 시에는 path를 명시해주는 것이 안전합니다.
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        };

        try {
            const response = await fetch("/api/logout", { // '/api' 프록시 경로 추가
                method: "POST",
                headers: {
                    // 토큰이 있을 경우에만 Authorization 헤더를 추가합니다.
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            
            // fetch가 성공하면 항상 클라이언트 세션을 정리합니다.
            clearClientSession();

            if (!response.ok) {
                // 응답이 성공적이지 않더라도 로그인 페이지로 리디렉션합니다.
                console.error("Logout failed with status:", response.status);
                window.location.href = "/login";
                return;
            }

            const result = await response.json();

            // 서버가 제공하는 redirectUrl로 이동합니다.
            if (result?.data?.redirectUrl) {
                window.location.href = result.data.redirectUrl;
            } else {
                window.location.href = "/login";
            }
        } catch (err) {
            console.error("로그아웃 처리 중 에러 발생:", err);
            // 에러 발생 시에도 클라이언트 세션을 정리하고 로그인 페이지로 이동합니다.
            clearClientSession();
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isInitiallizing }}>
            {children}
        </AuthContext.Provider>
    );
}
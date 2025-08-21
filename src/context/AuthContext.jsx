import { createContext, useState, useEffect } from "react";

//1. 인증 컨텍스트(저장소) 생성하기
export const AuthContext = createContext();

// 2. 컨텍스트 공급자(AuthProvider) 컴포넌트
// 이 컴포넌트가 앱 전체의 로그인 상태를 관리합니다.
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("loggedInUser");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    // 로그인 함수
    // 실제 API 연동 시, 이 함수 내부에서 fetch 요청을 보냅니다.
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
    };

    //로그아웃 함수
    const logout = () => {
        setUser(null);
        localStorage.removeItem("loggedInUser");
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refreshToken=; expires=Thu, 01, Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
    };

/* const logoutApi = async () => {
        const token = getCookie("accessToken");

        try {
            const response = await fetch("/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            setUser(null);
            localStorage.removeItem("loggedInUser");
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01, Jan 1970 00:00:00 UTC; path=/;";

            if (result?.data?.redirectUrl) {
                window.location.href = result.data.redirectUrl;
            } else {
                window.location.href = "/login";
            }
        } catch (err) {
            setUser(null);
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01, Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
        }
    };

    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)")
        );
        return match ? match [2] : null;
    }; 
*/

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * 역할 기반으로 접근을 제어하는 보호된 라우트 컴포넌트입니다.
 * 여러 역할을 배열로 받아 접근을 허용할 수 있습니다.
 * @param {object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 렌더링할 자식 컴포넌트
 * @param {string[]} props.allowedRoles - 접근을 허용할 역할(role)들의 배열
 */
function PrivateRoute({ children, allowedRoles }) {
    const { user, isInitializing } = useContext(AuthContext);
    const location = useLocation();

    // 1. 로그인 상태 확인
    if (isInitializing) {
        return <div>로딩 중...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. 역할(권한) 확인
    // [오류 수정] allowedRoles가 배열이 아니거나 존재하지 않으면 접근을 막습니다.
    if (!allowedRoles || !Array.isArray(allowedRoles) || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. 모든 검사를 통과한 경우
    return children;
}

export default PrivateRoute;

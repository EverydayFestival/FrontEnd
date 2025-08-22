import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
// AuthContext의 경로가 올바른지 확인해주세요.
// 예: src/components에 이 파일이 있다면 '../context/AuthContext.jsx'가 될 수 있습니다.
import { AuthContext } from '../context/AuthContext'; 

const MyPageRouter = () => {
    // 1. AuthContext에서 사용자 정보를 가져옵니다.
    // 컨텍스트가 'user' 객체에 'role' 속성을 제공한다고 가정합니다.
    // 속성 이름이 다른 경우(예: userInfo.role) 여기를 수정해주세요.
    const { user } = useContext(AuthContext);

    // 2. 사용자 데이터를 가져오는 동안 로딩 메시지를 표시합니다.
    if (!user) {
        return <div>사용자 정보를 불러오는 중...</div>;
    }

    // 3. switch 문을 사용하여 사용자의 역할을 확인하고 리디렉션합니다.
    switch (user.role) {
        case '축제 기획자':
            // 사용자가 축제 기획자인 경우 해당 페이지로 리디렉션합니다.
            return <Navigate to="/mypage/festival/ongoing" replace />;
        case '업체':
            // 사용자가 업체인 경우 해당 페이지로 리디렉션합니다.
            return <Navigate to="/mypage/company/apply" replace />;
        case '단기 근로자':
            // 사용자가 단기 근로자인 경우 해당 페이지로 리디렉션합니다.
            return <Navigate to="/mypage/labor/apply" replace />;
        default:
            // 역할이 알려지지 않았거나 일치하지 않는 경우 홈페이지로 리디렉션합니다.
            return <Navigate to="/" replace />;
    }
};

export default MyPageRouter;
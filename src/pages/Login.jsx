import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../styles/Login.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    // 선택된 역할을 저장하는 state ('festival', 'company', 'worker')
    const [role, setRole] = useState(null);
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // 역할 정보를 담은 배열
    const roles = [
        { key: "festival", name: "축제기획자", img: "/images/festival.png" },
        { key: "company", name: "업체", img: "/images/company.png" },
        { key: "worker", name: "단기근로자", img: "/images/worker.png" },
    ];

    // 역할별로 보여줄 안내 메시지
    const roleLoginInfo = {
        festival: (
            <p>
                ID: H_acc_#,
                PW: H_pwd_#
                <br/>(#: 0~9)
                으로만 로그인하십시오.
            </p>
        ),
        company: (
            <p>
                ID: C_acc_#,
                PW: C_pwd_#
                <br/>(#: 0~9)
                으로만 로그인하십시오.
            </p>
        ),
        worker: (
            <p>
                ID: L_acc_#,
                PW: L_pwd_#
                <br/>(#: 0~9)
                으로만 로그인하십시오.
            </p>
        ),
    };

    // 역할 카드 클릭 시, 선택된 역할의 key를 state에 저장하는 핸들러
    const handleRoleChange = (roleKey) => {
        setRole(roleKey);
        setError(null); // 역할을 변경하면 에러 메시지를 초기화합니다.
    };

    // 실제 API를 이용한 로그인 핸들러
    const handleLogin = async (e) => {
        e.preventDefault();

        // 역할이 선택되었는지 먼저 확인합니다.
        if (!role) {
            setError("먼저 역할을 선택해주세요.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    account,
                    password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // API 인증 성공 시
                // 1. 토큰을 localStorage에 저장
                localStorage.setItem("accessToken", result.accessToken);
                localStorage.setItem("refreshToken", result.refreshToken);

                // 2. 선택된 역할의 전체 이름(name)을 찾습니다.
                const selectedRoleObject = roles.find(r => r.key === role);
                const roleName = selectedRoleObject ? selectedRoleObject.name : '';

                // 3. AuthContext에 계정 정보와 '선택했던 역할 이름'을 저장합니다.
                login({ account, role: roleName });

                // 4. API가 지정한 URL 또는 기본 URL로 이동합니다.
                navigate(result.redirectUrl || "/");

            } else {
                // API 인증 실패 시
                setError(result.message || "로그인에 실패했습니다.");
            }
        } catch (err) {
            console.error("Login API error:", err);
            setError("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

     return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-title">
                    <h2>환영합니다!</h2>
                    <p>현재 본인의 상태를 선택해주세요</p>
                </div>

                <div className="roles-container">
                    {roles.map((roleItem) => (
                        <div
                            key={roleItem.key}
                            className={`role-card role-${roleItem.key} ${
                                role === roleItem.key ? "role-selected" : ""
                            }`}
                            onClick={() => handleRoleChange(roleItem.key)}
                        >
                            <img
                                src={roleItem.img}
                                alt={roleItem.name}
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/80x80/e2e8f0/4a5568?text=?'; }}
                            />
                            <p>{roleItem.name}</p>
                        </div>
                    ))}
                </div>

                {role && (
                    <div className="login-info">
                        {roleLoginInfo[role]}
                    </div>
                )}
                {/* ===== END: ADDED CODE ===== */}


                <form onSubmit={handleLogin} className="login-form space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="아이디"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="toggle-password"
                        >
                            {showPassword ? "숨기기" : "보기"}
                        </button>
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <div>
                        <button type="submit" className="login-button">
                            로그인
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
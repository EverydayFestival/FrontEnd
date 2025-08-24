import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">환영합니다!</h2>
                    <p className="mt-2 text-gray-600">현재 본인의 상태를 선택해주세요</p>
                </div>

                {/* 역할 선택 UI */}
                <div className="flex justify-around items-start text-center">
                    {roles.map((roleItem) => (
                        <div
                            key={roleItem.key}
                            className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                role === roleItem.key
                                    ? "bg-blue-100 scale-105 shadow-lg"
                                    : "hover:bg-gray-50"
                            }`}
                            onClick={() => handleRoleChange(roleItem.key)}
                        >
                            <img
                                src={roleItem.img}
                                alt={roleItem.name}
                                className="w-20 h-20 object-cover rounded-full mb-3"
                                // 이미지 로드 실패 시 대체 이미지를 보여줍니다.
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/80x80/e2e8f0/4a5568?text=?'; }}
                            />
                            <p
                                className={`font-semibold ${
                                    role === roleItem.key
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                }`}
                            >
                                {roleItem.name}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 로그인 폼 */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="아이디"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* 3. 비밀번호 입력 필드와 보기/숨기기 버튼을 함께 배치합니다. */}
                    <div className="relative">
                        <input
                            // 4. type을 state에 따라 동적으로 변경합니다.
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {/* 5. 버튼 클릭 시 showPassword state를 토글(뒤집기)합니다. */}
                        <button
                            type="button" // form의 submit을 방지하기 위해 type="button"을 꼭 넣어주세요.
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                        >
                            {showPassword ? "숨기기" : "보기"}
                        </button>
                    </div>

                    {error && <p className="text-sm text-center text-red-500">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                        >
                            로그인
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;

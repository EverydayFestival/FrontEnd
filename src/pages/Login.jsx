import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [role, setRole] = useState("festival");
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    //목업 계정
    const mockUsers = {
        festival: { id: "H001", password: "1234", role: "축제 기획자"},
        company: { id: "C001", password: "1234", role: "업체"},
        worker: { id: "W001", password: "1234", role: "단기 근로자"},
    };

    const handleRoleChange = (rolekey) => {
        setRole(rolekey);
        setAccount(mockUsers[rolekey].id);
        setPassword("");
        setError(null); //역할 변경 시 에러 메시지 초기화
    };

    //목업 로그인 핸들러
    const handleLogin = (e) => {
        e.preventDefault();

        const userInfo = mockUsers[role];

        if (account === userInfo.id && password === userInfo.password) {
            login({ account, role: userInfo.role });
            navigate("/");
        } else {
            setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    };

    const roles = [
        { key: "festival", name: "축제기획자", img: "/images/festival.png" },
        { key: "company", name: "업체", img: "/images/company.png" },
        { key: "worker", name: "단기 근로자", img: "/images/worker.png" },
    ];

    //실제 API
    /*
    const handleLogin = async (e) => {
        e.preventDefault ();
        
        try (
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-type": "application/json"},
                body: JSON.stringify ({
                    account,
                    password,
                }),
            });
            
            const result = await response.json();

            if (result.success) {
                document.cookie = `accessToken=${result.data.tokens.accessToken}; path=/`;
                document.cookie = `refreshToken=${result.data.tokens.refreshToken}; path=/`;
                
                login({ account, role: result.data.tokens.role });
                
                navigate(result.data.redirectUrl || "/");
            } else {
                setError(result.message);
            }
        } catch (err) {
         setError("서버 오류가 발생했습니다.");
        }     
    };
    */

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
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 에러 메시지 표시 */}
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
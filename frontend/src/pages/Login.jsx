import api from "../api/axios";
import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "../hooks/auth/useAuth.js";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth(false);

    const navigate = useNavigate();

    // 로그인 로직
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api.post("/api/auth/login", {email: email.trim(), password});
           const userData = await login();

if (userData.role === "ADMIN") {
    navigate("/admin");
} else {
    navigate("/");
}
        } catch (err) {
            console.error("로그인 실패:", err);
            const errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-8">
                <div className="relative z-10 w-full max-w-[400px] px-5 mt-[-50px]">
                    <div className="rounded-[20px] shadow-lg p-6 relative z-10 mt-10 bg-[url('../assets/images/login-background.png')] bg-cover bg-bottom bg-white">

                        <div className="text-center relative mb-6 ">
                            <img src="/src/assets/images/characters/rumi-left.png" alt="봄길요양 캐릭터"
                                 className="absolute -top-6 -right-10 w-28 h-auto z-20"/>
                            <h1 className="mt-10 text-3xl font-bold text-[#1F3D2D] mb-2 tracking-tight">
                                로그인
                            </h1>
                            <p className="text-gray-500 text-sm">봄길요양에 오신 것을 환영합니다</p>
                        </div>

                        {/* 에러 메시지 배너 */}
                        {error && (
                            <div
                                className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center font-medium">
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="relative mb-3 ">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <input type="email" name="email" placeholder="이메일을 입력하세요"
                                       className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm text-gray-700 placeholder-gray-400 bg-gray-50/50"
                                       value={email}
                                       onChange={(e) => setEmail(e.target.value)}
                                       required/>
                            </div>

                            <div className="relative mb-5">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                </div>
                                <input type={showPassword ? "text" : "password"} name="password" id="password"
                                       placeholder="비밀번호를 입력하세요"
                                       className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm text-gray-700 placeholder-gray-400 bg-gray-50/50"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                       required/>

                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div className="flex justify-end items-center gap-4">
                                <button type="submit"
                                        className="w-full bg-brand-green hover:bg-brand-greenHover text-white py-3.5 rounded-xl transition font-medium shadow-sm disabled:opacity-50"
                                        disabled={isLoading}>
                                    {isLoading ? "로그인 중..." : "로그인"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-[13px]">
                            <span className="text-gray-500">아직 회원이 아니신가요?</span>
                            <Link to="/signup" className="text-[#4A8A54] font-medium hover:underline ml-1">회원가입</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

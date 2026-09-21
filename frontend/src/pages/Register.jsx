import { useState } from "react";
import api from "../api/axios.js";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");

    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [checkedEmailValue, setCheckedEmailValue] = useState("");
    const [emailMsg, setEmailMsg] = useState({ text: "", type: "" }); // type: 'error' | 'success' | 'info'

    const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" }); // type: 'error' | 'success'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // 이메일 정규식 패턴
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // 비밀번호 패턴 : 8~16자, 영어 문자, 숫자 포함
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)\S{8,16}$/;

    const validateEmailFormat = (val) => {
        if (!val) {
            setEmailMsg({ text: "", type: "" });
            return false;
        }
        if (emailPattern.test(val)) {
            setEmailMsg({ text: "올바른 형식의 이메일입니다. 중복 확인을 진행해주세요.", type: "info" });
            return true;
        } else {
            setEmailMsg({ text: "올바른 이메일 형식을 입력해주세요.", type: "error" });
            return false;
        }
    };

    const handleEmailChange = (val) => {
        setEmail(val);
        setIsEmailChecked(false);
        setCheckedEmailValue("");
        validateEmailFormat(val);
    };

    const checkDuplicatedEmail = async () => {
        const emailVal = email.trim();
        if (!emailVal) {
            setEmailMsg({ text: "이메일을 입력해주세요.", type: "error" });
            return;
        }

        if (!emailPattern.test(emailVal)) {
            setEmailMsg({ text: "올바른 이메일 형식을 입력해주세요.", type: "error" });
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get(`/api/auth/check-email?email=${encodeURIComponent(emailVal)}`);
            if (response.data === true) {
                setEmailMsg({ text: "이미 사용 중인 이메일입니다.", type: "error" });
                setIsEmailChecked(false);
            } else {
                setEmailMsg({ text: "사용 가능한 이메일입니다.", type: "success" });
                setIsEmailChecked(true);
                setCheckedEmailValue(emailVal);
            }
        } catch (err) {
            console.error('Error checking email:', err);
            setEmailMsg({ text: "이메일 중복 확인 중 오류가 발생했습니다.", type: "error" });
            setIsEmailChecked(false);
        } finally {
            setIsLoading(false);
        }
    };

    const validatePassword = (val) => {
        if (!val) {
            setPasswordMsg({ text: "", type: "" });
            return false;
        }
        if (passwordPattern.test(val)) {
            setPasswordMsg({ text: "안전한 비밀번호입니다.", type: "success" });
            return true;
        } else {
            setPasswordMsg({ text: "비밀번호는 영문, 숫자를 조합하여 8~16자로 입력해주세요.", type: "error" });
            return false;
        }
    };

    const handlePasswordChange = (val) => {
        setPassword(val);
        validatePassword(val);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setApiError("");

        const emailVal = email.trim();
        if (!isEmailChecked || emailVal !== checkedEmailValue) {
            setApiError("이메일 중복 확인을 완료해주세요.");
            return;
        }

        if (!passwordPattern.test(password)) {
            setApiError("비밀번호를 규칙에 맞게 입력해주세요.");
            return;
        }

        if (password !== confirmPwd) {
            setApiError("비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        setIsLoading(true);
        try {
            await api.post(
                "/api/auth/signup",
                {
                    name,
                    email: emailVal,
                    password
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            alert("회원가입이 완료되었습니다. 로그인해주세요.");
            navigate("/login");
        } catch (err) {
            console.error('회원가입 에러:', err);
            setApiError(err.response?.data?.message || err.response?.data || "회원가입 실패: 정보가 올바르지 않습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-10">
            <div className="relative z-10 w-full max-w-[400px] px-5 mt-[-50px] ">
                <div className="rounded-[20px] shadow-lg p-6 relative z-10 mt-10 bg-[url('/images/login-background.png')] bg-cover bg-bottom bg-white">
                    <div className="text-center relative mb-6 ">
                        <h1 className="mt-10 text-3xl font-bold text-[#1F3D2D] mb-2 tracking-tight">
                            회원가입
                        </h1>
                        <p className="text-gray-500 text-sm">봄길요양과 함께 따뜻한 시설을 찾아보세요</p>
                    </div>

                    {apiError && (
                        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center font-medium">
                            {apiError}
                        </div>
                    )}

                    <form id="signupForm" onSubmit={handleRegister}>
                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                          d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <input type="text" name="name" placeholder="이름을 입력하세요"
                                   className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm text-gray-700 placeholder-gray-400 bg-gray-50/50"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   required />
                        </div>

                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input type="email" name="email" id="email" placeholder="이메일을 입력하세요"
                                className="w-full pl-11 pr-32 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm text-gray-700 placeholder-gray-400 bg-gray-50/50"
                                   value={email}
                                   onChange={(e) => handleEmailChange(e.target.value)}
                                   required />
                            <button type="button" id="checkEmailBtn"
                                className="absolute inset-y-1.5 right-1.5 px-3 bg-brand-green hover:bg-brand-greenHover text-white text-xs font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                                onClick={checkDuplicatedEmail}
                                disabled={isLoading}>
                                중복 확인
                            </button>
                        </div>
                        {emailMsg.text && (
                            <div className={`text-xs mt-1 mb-3 px-1 font-medium ${
                                emailMsg.type === 'success' ? 'text-emerald-600' :
                                emailMsg.type === 'info' ? 'text-blue-600' : 'text-rose-500'
                            }`}>
                                {emailMsg.text}
                            </div>
                        )}

                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder="비밀번호를 입력하세요"
                                className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm text-gray-700 placeholder-gray-400 bg-gray-50/50"
                                   value={password}
                                   onChange={(e) => handlePasswordChange(e.target.value)}
                                required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {passwordMsg.text && (
                            <div className={`text-xs mt-1 mb-3 px-1 font-medium ${
                                passwordMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
                            }`}>
                                {passwordMsg.text}
                            </div>
                        )}

                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" placeholder="비밀번호 확인"
                                className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm text-gray-700 placeholder-gray-400 bg-gray-50/50"
                                   value={confirmPwd}
                                   onChange={(e) => setConfirmPwd(e.target.value)}
                                required />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                                {showConfirmPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {confirmPwd && (
                            password === confirmPwd ? (
                                <p className="text-xs mt-1 mb-4 px-1 text-emerald-600 font-medium">
                                    비밀번호 확인이 일치합니다.
                                </p>
                            ) : (
                                <p className="text-xs mt-1 mb-4 px-1 text-rose-500 font-medium">
                                    비밀번호 확인이 일치하지 않습니다.
                                </p>
                            )
                        )}

                        <button type="submit" className="w-full bg-brand-green hover:bg-brand-greenHover text-white font-medium py-3.5 rounded-xl transition-colors duration-200 shadow-sm disabled:opacity-50" disabled={isLoading}>
                            {isLoading ? "가입 처리 중..." : "회원가입"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-[13px]">
                        <span className="text-gray-500">이미 계정이 있으신가요?</span>
                        <Link to="/login" className="text-[#4A8A54] font-medium hover:underline ml-1">로그인</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

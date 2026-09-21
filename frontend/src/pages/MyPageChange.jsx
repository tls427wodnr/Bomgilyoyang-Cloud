import { useState, useEffect } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function MyPageChange() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [withdrawPassword, setWithdrawPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // 사용자 정보 조회
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get("/api/auth/me");
                setUsername(response.data.name || "");
                setEmail(response.data.email || "");
            } catch (err) {
                console.error("프로필 조회 실패:", err);
                setError("사용자 정보를 불러올 수 없습니다. 다시 로그인해 주세요.");
            }
        };
        fetchUserProfile();
    }, []);

    // 내 정보 (아이디/이름) 수정 제출
    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        if (!username.trim()) {
            setError("수정할 아이디(이름)를 입력해주세요.");
            return;
        }
        setIsLoading(true);
        try {
            await api.post("/api/auth/update", { name: username });
            setMessage("내 정보가 성공적으로 수정되었습니다.");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data || "정보 수정에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 비밀번호 변경 제출
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!currentPassword) {
            setError("현재 비밀번호를 입력해주세요.");
            return;
        }

        // 새 비밀번호 패턴 검증 (8~20자, 영문, 숫자, 특수문자 포함)
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)\S{8,16}$/;
        if (!passwordPattern.test(newPassword)) {
            setError("새 비밀번호는 영문, 숫자를 포함하여 8~16자로 입력해주세요.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError("새 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/api/auth/password/change", {
                oldPassword: currentPassword,
                newPassword: newPassword
            });
            setMessage("비밀번호가 성공적으로 변경되었습니다.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data || "비밀번호 변경에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 회원 탈퇴 제출
    const handleWithdrawSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!withdrawPassword) {
            setError("탈퇴를 진행하려면 비밀번호를 입력해야 합니다.");
            return;
        }

        if (!window.confirm("정말로 탈퇴하시겠습니까? 탈퇴 시 즐겨찾기, 작성한 글 등 모든 데이터가 복구 불가능하게 삭제됩니다.")) {
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/api/auth/withdraw", { password: withdrawPassword });
            alert("회원 탈퇴가 성공적으로 처리되었습니다. 이용해 주셔서 감사합니다.");
            localStorage.removeItem("accessToken");
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data || "회원 탈퇴 처리 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-linear-to-b from-[#E0F0E9] to-[#C9E4D6] min-h-screen text-gray-800">
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                
                {error && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center font-medium">
                        <span>{error}</span>
                    </div>
                )}
                
                {message && (
                    <div className="p-3.5 bg-green-50 border border-green-200 text-green-600 rounded-xl text-xs text-center font-medium">
                        <span>{message}</span>
                    </div>
                )}

                <div className="flex-1 max-w-2xl space-y-6">
                    {/* 내 정보 수정 */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">내 정보 수정</h2>
                        <p className="text-sm text-gray-500 mb-8">아이디를 수정할 수 있습니다.</p>

                        <form onSubmit={handleInfoSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">아이디</label>
                                <div className="relative">
                                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)}
                                           className="w-full px-4 py-3 border border-green-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green text-sm text-gray-900 bg-white" required />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">영문, 숫자 포함 4~20자</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">이메일</label>
                                <div className="relative">
                                    <input type="email" name="email" value={email} readOnly
                                           className="w-full px-4 py-3 border border-green-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green text-sm text-gray-900 bg-gray-100" />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">이메일은 변경할 수 없습니다.</p>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-brand-green hover:bg-brand-greenHover text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50" disabled={isLoading}>
                                    저장하기
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* 비밀번호 변경 */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">비밀번호 변경</h2>
                        <p className="text-sm text-gray-500 mb-8">안전한 계정 사용을 위해 주기적으로 비밀번호를 변경하세요.</p>

                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">현재 비밀번호</label>
                                <div className="relative">
                                    <input type={showCurrentPassword ? "text" : "password"} name="currentPassword" placeholder="현재 비밀번호를 입력해주세요."
                                           value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                                           className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm placeholder-gray-400 bg-gray-50/50" required />
                                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">새 비밀번호</label>
                                <div className="relative">
                                    <input type={showNewPassword ? "text" : "password"} name="newPassword" placeholder="새 비밀번호를 입력해주세요."
                                           value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                           className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm placeholder-gray-400 bg-gray-50/50" required />
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">새 비밀번호 확인</label>
                                <div className="relative">
                                    <input type={showConfirmNewPassword ? "text" : "password"} name="confirmNewPassword" placeholder="새 비밀번호를 다시 입력해주세요."
                                           value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                                           className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm placeholder-gray-400 bg-gray-50/50" required />
                                    <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">영문, 숫자, 포함 8~16자</p>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-brand-green hover:bg-brand-greenHover text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50" disabled={isLoading}>
                                    변경하기
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* 회원 탈퇴 */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 border-t-[3px] border-t-red-50">
                        <h2 className="text-xl font-bold text-red-500 mb-1">회원 탈퇴</h2>
                        <p className="text-sm text-gray-500 mb-8">회원 탈퇴 시 계정 정보와 즐겨찾기, 리뷰 등 모든 데이터가 삭제되며,<br />복구가 불가능합니다.</p>

                        <form onSubmit={handleWithdrawSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호 확인</label>
                                <div className="relative">
                                    <input type={showWithdrawPassword ? "text" : "password"} name="withdrawPassword" placeholder="비밀번호를 입력해주세요."
                                           value={withdrawPassword} onChange={(e) => setWithdrawPassword(e.target.value)}
                                           className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 text-sm placeholder-gray-400 bg-gray-50/50" required />
                                    <button type="button" onClick={() => setShowWithdrawPassword(!showWithdrawPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="border border-red-200 text-red-500 bg-white hover:bg-red-50 font-medium px-8 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50" disabled={isLoading}>
                                    회원 탈퇴하기
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
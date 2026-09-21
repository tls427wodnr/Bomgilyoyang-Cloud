import { AuthContext } from "./AuthContext.jsx";
import { useState, useEffect } from "react";
import api from "../../api/axios.js";

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

     useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await api.get("/api/auth/me");

                console.log("현재 로그인 사용자:", response.data);

                setIsLoggedIn(true);
                setUser(response.data);
            } catch (e) {
                setIsLoggedIn(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

     const login = async () => {
    try {
        const response = await api.get("/api/auth/me");

        console.log("로그인 후 사용자 정보:", response.data);

        setIsLoggedIn(true);
        setUser(response.data);

        return response.data;
    } catch (error) {
        console.error("로그인 후 사용자 정보 조회 실패:", error);

        setIsLoggedIn(false);
        setUser(null);

        throw error;
    }
};
const logout = async () => {
    try {
        await api.post("/api/auth/logout");
    } catch (error) {
        console.error("로그아웃 API 실패:", error);
    } finally {
        setIsLoggedIn(false);
        setUser(null);
    }
};
    // const logout = () => {
    //     setIsLoggedIn(false);
    //     setUser(null);
    // };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 bg-gray-50">
                인증 상태 확인 중...
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn,user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
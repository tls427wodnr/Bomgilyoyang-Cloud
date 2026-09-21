import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import Layout from "./components/common/Layout.jsx";
import { AuthProvider } from "./context/auth/AuthProvider.jsx";
import { AuthContext } from "./context/auth/AuthContext.jsx";
import api from "./api/axios.js";
import Home from "./pages/Home.jsx";
import Map from "./pages/Map.jsx";
import BoardList from "./pages/BoardList.jsx";
import BoardEdit from "./pages/BoardEdit.jsx";
import BoardDetail from "./pages/BoardDetail.jsx";
import BoardWrite from "./pages/BoardWrite.jsx";
import MyPage from "./pages/MyPage.jsx";
import Admin from "./pages/Admin.jsx";
import Chat from "./pages/Chat.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import MyPageChange from "./pages/MyPageChange.jsx";
import CareGrade from "./pages/CareGrade.jsx";
import CareGradeTest from "./pages/CareGradeTest.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
const { isLoggedIn, logout, user } = useContext(AuthContext);


  // 현재 AuthProvider는 role을 안 가지고 있으니까 임시로 USER 처리
const role = isLoggedIn ? user?.role ?? "USER" : "ANONYMOUS";

  const isMapPage = location.pathname === "/map";
  const isChatPage = location.pathname.startsWith("/chatrooms/");
  
const handleLogout = async () => {
    await logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
};

   const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<Map />} />

      <Route path="/boards" element={<BoardList />} />
      <Route path="/boards/new" element={<BoardWrite />} />
      <Route path="/boards/:boardId" element={<BoardDetail />} />
      <Route path="/boards/:boardId/edit" element={<BoardEdit />} />

      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypagechange" element={<MyPageChange />} />

      <Route path="/admin" element={<Admin />} />
        <Route path="/caregrade" element={<CareGrade />} />
        <Route path="/caregrade/test" element={<CareGradeTest />} />

      <Route path="/chatrooms/:roomId/message" element={<Chat />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );

  if (isChatPage) {
    return routes;
  }

  return (
    <Layout role={role} onLogout={handleLogout} showFooter={!isMapPage}>
      {routes}
    </Layout>
  );
}


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
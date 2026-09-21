import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

/**
 * 공통 레이아웃
 *
 * Props:
 *   children - 페이지 내용
 *   role - "ADMIN" | "USER" | "ANONYMOUS"
 *   onLogout - 로그아웃 핸들러
 */

const Layout = ({
  children,
  role = "ANONYMOUS",
  onLogout,
  showFooter = true,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8faf8",
        overflow: "hidden",
      }}
    >
      <Header role={role} onLogout={onLogout} />

     <main
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          background: "#EEF4EF",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            // Footer가 있는 일반 페이지는 콘텐츠보다 작게 축소되지 않아야
            // Footer가 긴 페이지의 콘텐츠 중간에 끼어들지 않는다.
            flex: showFooter ? "1 0 auto" : 1,
            minHeight: showFooter ? "auto" : 0,
            ...(showFooter ? {} : { height: "100%", overflow: "hidden" }),
          }}
        >
          {children}
        </div>

        {showFooter && <Footer />}
      </main>
    </div>
  );
};

export default Layout;

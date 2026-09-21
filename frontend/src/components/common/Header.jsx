import { Link, useLocation } from "react-router-dom";
import mainIcon from "../../assets/images/icons/main-icon.png";
import "./Header.css";

/**
 * 봄길요양 Header 공통 컴포넌트
 *
 * Props:
 *   role - "ADMIN" | "USER" | "ANONYMOUS"
 *   onLogout - 로그아웃 핸들러 함수
 */

const NAV_LINKS = [
  { label: "지도", to: "/map" },
  { label: "장기요양등급 확인", to: "/caregrade" },
  { label: "게시판", to: "/boards" },
];

const Header = ({ role = "ANONYMOUS", onLogout }) => {
  const location = useLocation();

  const isAdmin = role === "ADMIN";
  const isUser = role === "USER";
  const isAnon = role === "ANONYMOUS";

  const activeNav = location.pathname;

const ACTIVE_STYLE = {
  background: "#CFE0D1",
  color: "#2f4f3f",
  borderRadius: "8px",
};

  const NAV_BASE = {
    fontFamily: "'Eulyoo1945', serif",
    fontWeight: "bold",
    fontSize: "15px",
    textDecoration: "none",
    color: "#222",
    padding: "6px 14px",
    borderRadius: "8px",
    transition: "background 0.18s, color 0.18s",
    cursor: "pointer",
  };

  const BTN_BASE = {
    fontFamily: "'Eulyoo1945', serif",
    fontWeight: "bold",
    fontSize: "14px",
    padding: "9px 18px",
    borderRadius: "10px",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "background 0.18s, color 0.18s, transform 0.12s",
    background: "#4a8c6e",
    color: "#fff",
    display: "inline-block",
  };

const BTN_ACTIVE = {
  ...BTN_BASE,
  background: "#CFE0D1",
  color: "#2f4f3f",
};

  const isButtonActive = (path) => {
    return location.pathname === path;
  };

  const NavItem = ({ to, label }) => {
    const isActive = activeNav === to;

    return (
      <Link
        to={to}
       style={{
  ...NAV_BASE,
  ...(isActive ? ACTIVE_STYLE : {}),
}}
      >
        {label}
      </Link>
    );
  };

  const ActionButton = ({ to, label, onClick }) => {
    if (onClick) {
      return (
        <button
          type="button"
          style={BTN_BASE}
          onClick={onClick}
        >
          {label}
        </button>
      );
    }

    return (
      <Link
        to={to}
        style={isButtonActive(to) ? BTN_ACTIVE : BTN_BASE}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className="site-header"
  style={{
    fontFamily: "'Eulyoo1945', serif",
    zIndex: 200,
    background: "#fff",
    height: "58px",
    padding: "0 28px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.13)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  }}
>
      {/* 왼쪽 로고 */}
      <Link
        className="site-header__brand"
        to={isAdmin ? "/admin" : "/"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
        }}
      >
        <img
          src={mainIcon}
          alt="로고"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <span
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            color: "#222",
          }}
        >
          봄길요양
        </span>
      </Link>

      {/* 가운데 메뉴: 일반 사용자 / 비로그인만 표시 */}
      {!isAdmin && (
        <nav
          className="site-header__nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {NAV_LINKS.map((nav) => (
            <NavItem
              key={nav.to}
              to={nav.to}
              label={nav.label}
            />
          ))}
        </nav>
      )}

      {/* 오른쪽 버튼 영역 */}
      <div
        className="site-header__actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {isAnon && (
          <>
            <ActionButton to="/login" label="로그인" />
            <ActionButton to="/signup" label="회원가입" />
          </>
        )}

        {isUser && (
          <>
            <ActionButton to="/mypage" label="마이페이지" />
            <ActionButton label="로그아웃" onClick={onLogout} />
          </>
        )}

        {isAdmin && (
          <ActionButton label="로그아웃" onClick={onLogout} />
        )}
      </div>
    </header>
  );
};

export default Header;

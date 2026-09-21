const Footer = () => {
  return (
    <footer
      style={{
        fontFamily: "'Eulyoo1945', serif",
        padding: "16px 20px",
        textAlign: "center",
        background: "#f8faf8",
        borderTop: "1px solid #d9e2dc",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            color: "#4a8c6e",
            fontSize: "18px",
            marginBottom: "4px",
          }}
        >
          봄길요양
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#666",
            marginBottom: "4px",
            lineHeight: 1.5,
          }}
        >
          부모님 생활환경까지 보는 복지시설 지도 서비스
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#999",
          }}
        >
          © 2026 Neulbomgil | KOSA Team Gooroomees
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { useNavigate } from "react-router-dom";
import rumiError from "../assets/images/characters/rumi-error.png";

function ErrorPage() {
  const navigate = useNavigate();

  const handleMoveHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <main
      className="w-full flex items-center justify-center px-4 py-16 box-border"
      style={{
        minHeight: "calc(100vh - 160px)",
        backgroundColor: "#F5F6F3",
      }}
    >
      <section
        className="w-full max-w-3xl bg-white rounded-2xl shadow-sm text-center"
        style={{
          padding: "52px 32px 58px",
          border: "1px solid #E5E7EB",
        }}
      >
        <img
          src={rumiError}
          alt="페이지를 찾지 못한 루미"
          style={{
            width: "260px",
            maxWidth: "80%",
            margin: "0 auto 22px",
            display: "block",
          }}
        />

        <div
          className="font-bold"
          style={{
            fontSize: "54px",
            color: "#5F8F73",
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          404
        </div>

        <h1
          className="font-bold"
          style={{
            fontSize: "28px",
            marginBottom: "14px",
            color: "#222",
          }}
        >
          페이지를 찾을 수 없습니다
        </h1>

        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.8,
            color: "#666",
            marginBottom: "34px",
          }}
        >
          요청하신 페이지가 사라졌거나 주소가 변경되었어요.
          <br />
          루미가 열심히 찾고 있지만 아직 발견하지 못했어요.
        </p>

        <div
          className="flex justify-center"
          style={{
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleGoBack}
            className="font-bold rounded-md"
            style={{
              minWidth: "140px",
              height: "46px",
              fontSize: "16px",
              color: "#2F4F3D",
              backgroundColor: "#F5F6F3",
              border: "1px solid #D9DED8",
              cursor: "pointer",
            }}
          >
            이전으로
          </button>

          <button
            type="button"
            onClick={handleMoveHome}
            className="text-white font-bold rounded-md"
            style={{
              minWidth: "140px",
              height: "46px",
              fontSize: "16px",
              backgroundColor: "#5F8F73",
              border: "none",
              cursor: "pointer",
            }}
          >
            홈으로 이동
          </button>
        </div>
      </section>
    </main>
  );
}

export default ErrorPage;
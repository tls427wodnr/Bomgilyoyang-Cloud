import { useNavigate } from "react-router-dom";

function CareGrade() {
  const navigate = useNavigate();

  const grades = [
    {
      title: "1등급",
      description: "전적으로 도움이 필요한 상태",
    },
    {
      title: "2등급",
      description: "상당 부분 도움이 필요한 상태",
    },
    {
      title: "3등급",
      description: "부분적인 도움이 필요한 상태",
    },
    {
      title: "4등급",
      description: "일정 부분 도움이 필요한 상태",
    },
    {
      title: "5등급",
      description: "치매 중심의 경증 상태",
    },
    {
      title: "인지지원등급",
      description: "인지 기능 중심 지원",
    },
  ];

  const handleMoveToTest = () => {
    navigate("/caregrade/test");
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-6 pb-20 box-border">
      <section className="rounded-xl bg-white px-8 py-9 shadow-sm">
        <h1
          className="text-center font-bold"
          style={{
            fontSize: "34px",
            marginBottom: "14px",
          }}
        >
          장기요양등급 이란?
        </h1>

        <p
          className="text-center"
          style={{
            fontSize: "20px",
            lineHeight: 1.8,
            color: "#555",
            marginBottom: "46px",
          }}
        >
          일상생활이 어려운 어르신에게 국가가 돌봄 서비스를 지원하기 위해
          <br />
          신체 및 인지 상태를 평가하여 부여하는 등급입니다.
          <br />
          <br />
          이 등급에 따라 이용할 수 있는 서비스와 지원 금액이 달라집니다.
        </p>

        <h2
          className="font-bold"
          style={{
            fontSize: "18px",
            marginBottom: "18px",
          }}
        >
          등급설명
        </h2>

        <div
          className="bg-white rounded-2xl border border-border"
          style={{
            padding: "28px 32px",
            marginBottom: "32px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {grades.map((grade) => (
              <div
                key={grade.title}
                className="font-bold"
                style={{
                  fontSize: "18px",
                  color: "#2F4F3D",
                }}
              >
                {grade.title} :
                <span
                  className="font-medium"
                  style={{
                    color: "#222",
                    marginLeft: "6px",
                  }}
                >
                  {grade.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <h2
          className="font-bold"
          style={{
            fontSize: "18px",
            marginBottom: "18px",
          }}
        >
          지원금 / 보험 설명
        </h2>

        <div
          className="bg-white rounded-2xl border border-border"
          style={{
            padding: "28px 32px",
            marginBottom: "32px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              lineHeight: 1.9,
              color: "#333",
            }}
          >
            장기요양등급을 받으면 등급에 따라 월 이용 한도가 정해지며,
            <br />
            그 범위 내에서 요양 서비스를 이용할 수 있습니다.
            <br />
            <br />
            시설 이용 시 약 20%,
            <br />
            재가 서비스 이용 시 약 15%의 본인부담금이 발생합니다.
            <p
              style={{
                marginTop: "18px",
                fontSize: "15px",
                color: "#666",
              }}
            >
              ※ 기초생활수급자 및 차상위계층은 본인부담금이 경감될 수
              있습니다.
            </p>
          </div>
        </div>

        <div
          className="flex justify-center"
          style={{
            marginTop: "48px",
          }}
        >
          <button
            type="button"
            className="text-white font-bold rounded-md transition-all duration-200 hover:-translate-y-0.5"
            style={{
              width: "340px",
              height: "58px",
              fontSize: "22px",
              backgroundColor: "#2F6F42",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1a4a28";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2F6F42";
            }}
            onClick={handleMoveToTest}
          >
            내 등급 확인하러 가기
          </button>
        </div>
      </section>
    </main>
  );
}

export default CareGrade;
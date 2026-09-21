import { useRef, useState } from "react";

function CareGradeTest() {
  const resultRef = useRef(null);

  const [checkedItems, setCheckedItems] = useState([]);
  const [result, setResult] = useState(null);

  const sections = [
    {
      title: "1. 신체 활동",
      items: [
        { id: "physical-1", text: "혼자서 식사하기 어렵다.", score: 3 },
        { id: "physical-2", text: "혼자서 화장실 이용이 어렵다.", score: 3 },
        { id: "physical-3", text: "옷 갈아입기나 세면에 도움이 필요하다.", score: 2 },
        {
          id: "physical-4",
          text: "실내 이동이나 침대에서 일어나는 데 도움이 필요하다.",
          score: 2,
        },
      ],
    },
    {
      title: "2. 인지 상태",
      items: [
        {
          id: "cognitive-1",
          text: "최근 일을 자주 잊거나 같은 말을 반복한다.",
          score: 3,
        },
        {
          id: "cognitive-2",
          text: "시간, 장소, 사람을 헷갈리는 경우가 있다.",
          score: 3,
        },
        {
          id: "cognitive-3",
          text: "약 복용이나 식사 시간을 자주 놓친다.",
          score: 2,
        },
      ],
    },
    {
      title: "3. 일상생활 관리",
      items: [
        {
          id: "daily-1",
          text: "외출 시 보호자 동행이 필요하다.",
          score: 2,
        },
        {
          id: "daily-2",
          text: "집안일, 장보기, 식사 준비가 어렵다.",
          score: 2,
        },
        {
          id: "daily-3",
          text: "혼자 생활하기에 불안한 상황이 자주 있다.",
          score: 1,
        },
      ],
    },
  ];

  const handleCheck = (itemId) => {
    setCheckedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }

      return [...prev, itemId];
    });
  };

  const calculateGrade = () => {
    const totalScore = sections
      .flatMap((section) => section.items)
      .filter((item) => checkedItems.includes(item.id))
      .reduce((sum, item) => sum + item.score, 0);

    let resultData;

    if (totalScore >= 18) {
      resultData = {
        title: "1등급: 돌봄 필요도가 매우 높은 상태입니다.",
        description:
          "일상생활 전반에서 많은 도움이 필요할 수 있습니다. 장기요양등급 신청을 적극적으로 검토해보는 것이 좋습니다.",
      };
    } else if (totalScore >= 12) {
      resultData = {
        title: "2등급: 돌봄 필요도가 높은 상태입니다.",
        description:
          "신체 활동 또는 인지 상태에서 도움이 필요한 부분이 있습니다. 가족 또는 전문가와 상담해보는 것을 권장합니다.",
      };
    } else if (totalScore >= 6) {
      resultData = {
        title: "3등급: 일부 도움이 필요한 상태입니다.",
        description:
          "현재는 부분적인 지원이 필요한 상태로 보입니다. 상태 변화가 지속된다면 장기요양 상담을 받아보는 것이 좋습니다.",
      };
    } else {
      resultData = {
        title: "4등급 ~ 5등급: 현재 돌봄 필요도가 낮은 상태입니다.",
        description:
          "현재 체크한 항목 기준으로는 돌봄 필요도가 높지 않아 보입니다. 다만 건강 상태 변화에 따라 주기적으로 확인해보는 것이 좋습니다.",
      };
    }

    setResult(resultData);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  };

  const resetCheck = () => {
    setCheckedItems([]);
    setResult(null);
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-6 pb-[50px] box-border">
      <section className="rounded-xl bg-white px-8 py-9 shadow-sm">
        <h1
          className="text-center font-bold"
          style={{
            fontSize: "32px",
            marginBottom: "12px",
          }}
        >
          장기요양등급 자가진단
        </h1>

        <p
          className="text-center"
          style={{
            fontSize: "15px",
            lineHeight: 1.8,
            color: "#555",
            marginBottom: "34px",
          }}
        >
          아래 항목은 실제 등급 판정이 아닌 참고용 자가진단입니다.
          <br />
          체크한 항목을 바탕으로 대략적인 돌봄 필요 정도를 확인할 수
          있습니다.
        </p>

        {sections.map((section) => (
          <section
            key={section.title}
            className="bg-white rounded-xl border border-border"
            style={{
              padding: "26px 30px",
              marginBottom: "18px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              className="font-bold"
              style={{
                fontSize: "20px",
                color: "#2F4F3D",
                marginBottom: "16px",
              }}
            >
              {section.title}
            </h3>

            {section.items.map((item) => (
              <label
                key={item.id}
                htmlFor={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 0",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                <input
                  id={item.id}
                  type="checkbox"
                  checked={checkedItems.includes(item.id)}
                  onChange={() => handleCheck(item.id)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#5F8F73",
                  }}
                />
                {item.text}
              </label>
            ))}
          </section>
        ))}

        <div
          className="flex justify-center"
          style={{
            gap: "12px",
            marginTop: "32px",
          }}
        >
          <button
            type="button"
            className="text-white font-bold rounded-md"
            style={{
              minWidth: "180px",
              height: "48px",
              fontSize: "17px",
              background: "#5F8F73",
              border: "none",
              cursor: "pointer",
            }}
            onClick={calculateGrade}
          >
            결과 확인하기
          </button>

          <button
            type="button"
            className="text-white font-bold rounded-md"
            style={{
              minWidth: "180px",
              height: "48px",
              fontSize: "17px",
              background: "#79A9BA",
              border: "none",
              cursor: "pointer",
            }}
            onClick={resetCheck}
          >
            다시 선택하기
          </button>
        </div>

        {result && (
          <section
            ref={resultRef}
            style={{
              marginTop: "28px",
              padding: "26px 30px",
              borderRadius: "20px",
              background: "#BDD2DC",
              color: "#22333A",
            }}
          >
            <div
              className="font-bold"
              style={{
                fontSize: "22px",
                marginBottom: "10px",
              }}
            >
              {result.title}
            </div>

            <div
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
              }}
            >
              {result.description}
            </div>
          </section>
        )}

        <p
          style={{
            marginTop: "24px",
            fontSize: "13px",
            color: "#777",
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          ※ 본 자가진단은 참고용이며, 실제 장기요양등급 판정은
          국민건강보험공단의 방문조사와 등급판정위원회를 통해 결정됩니다.
        </p>
      </section>
    </main>
  );
}

export default CareGradeTest;
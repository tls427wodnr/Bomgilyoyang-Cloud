import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import heroBg from "../assets/images/main/home-main.png";
import infoIllust from "../assets/images/main/home-side.jpg";
const features = [
  {
    icon: "🌳",
    title: "요양시설별 공원 접근성 점수 제공",
    desc: "요양시설 반경 2km 내 공원 정보를 한눈에 확인할 수 있습니다",
  },
  {
    icon: "📍",
    title: "지도 기반 요양시설 탐색",
    desc: "원하는 지역을 검색하면 지도에서 한눈에 요양 시설을 확인할 수 있습니다.",
  },
  {
    icon: "💬",
    title: "관리자 1:1 상담 채팅",
    desc: "문의사항에 대해 관리자와 실시간 1:1 채팅으로 빠르게 상담할 수 있습니다.",
  },
];

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={styles.wrap}>

      {/* ───── HERO ───── */}
      <section className={styles.hero}>
        {/* Background */}
        <div className={styles.heroBg}>
            <img 
              src={heroBg}
              alt="배경"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        </div>

        {/* Overlay */}
        <div className={styles.heroOverlay} />

        {/* Hero Content */}
        <div className={`${styles.heroContent} ${visible ? styles.visible : ""}`}>
          <div className={styles.heroBadge}>🌿 봄날같은 요양 시설을 찾아드립니다</div>
          <h1 className={styles.heroTitle}>
            늘 봄날 같은 산책을 위한<br/>
            <span className={styles.heroTitleAccent}>복지시설 선택 지도 서비스</span>
          </h1>
          <p className={styles.heroSub}>
            원하는 지역을 검색하고<br/>
            주변 복지시설과 공원을 함께 확인해보세요
          </p>
          <a href="/map" className={styles.ctaBtn}>
            <span>시설 검색하러 가기</span>
            <span className={styles.arrow}>→</span>
          </a>
        </div>
      </section>

      {/* ───── INTRO ───── */}
      <section className={styles.intro}>
        <p className={styles.introText}>
          소중한 부모님의 노후를 위한 최선의 선택.<br/>
          <span className={styles.introTextDark}>
            봄길요양은 공원 접근성·시설 정보·커뮤니티까지<br/>
            필요한 모든 것을 한곳에 모았습니다.
          </span>
        </p>
      </section>

      {/* ───── FEATURES ───── */}
      <section className={styles.features}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>서비스 소개</span>
            <h2 className={styles.sectionTitle}>봄길요양만의 특별한 서비스</h2>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.iconWrap}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── INFO ───── */}
      <section className={styles.info}>
        <div className={`${styles.sectionInner} ${styles.infoGrid}`}>
          {/* 일러스트 카드 */}
          <div className={styles.infoIllust}>
             <img 
              src={infoIllust}
              alt="배경"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            
          </div>

          {/* 텍스트 */}
          <div className={styles.infoText}>
            <span className={styles.badge}>왜 봄길요양인가요?</span>
            <h2 className={styles.infoTitle}>
              부모님의 산책이<br/>
              <span className={styles.infoTitleAccent}>더 행복해지는 선택</span>
            </h2>
            <p className={styles.infoDesc}>
              요양시설을 선택할 때 가장 중요한 것 중 하나는 주변 환경입니다.
              봄길요양은 각 시설의 공원 접근성을 직관적인 나무 마크로 안내하여,
              어르신이 자연 속에서 산책하고 휴식할 수 있는 최적의 시설을
              쉽게 찾을 수 있도록 도와드립니다.
            </p>
            {[
              "📍 지역별 시설과 가까운 공원 탐색",
              "📢 커뮤니티 제공",
              "💬 관리자와 1:1 채팅 제공",
            ].map((item, i, arr) => (
              <div key={i} className={styles.infoItem}
                style={{ borderBottom: i < arr.length - 1 ? "1px solid #e8f4ee" : "none" }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
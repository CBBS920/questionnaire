import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import qr from "../../img/line_qr.png";
import logo from "../../img/CBBS_2.png";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/survey");
    }, 1600); // 1.6秒後に遷移
  };

  return (
    <div className={styles.container}>
      {/* 左上ロゴボタン */}
      <img 
        src={logo} 
        alt="CBBS ロゴ" 
        className={styles.logo} 
        onClick={() => navigate("/")} 
      />

      <h1 className={styles.title}>CBBS アンケート</h1>
      <p className={styles.subtitle}>LINE のお友達募集中</p>
      <img src={qr} alt="LINE QRコード" className={styles.qr} />

      <button 
        className={styles.startButton}
        onClick={handleStart}
      >
        アンケートに答える
      </button>

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>読み込み中.....</p>
        </div>
      )}
    </div>
  );
};

export default Home;

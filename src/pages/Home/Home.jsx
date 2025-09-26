import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 1 }}
    >
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
    </motion.div>
  );
};

export default Home;

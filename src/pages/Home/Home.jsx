import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Home.module.css";
import qr from "../../img/line_qr.png";
import logo from "../../img/CBBS_2.png";

// トップ画面
const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // アンケート開始時の読み込み表示用state

  const handleStart = () => {
    // 読み込み表示をON
    setLoading(true);
    setTimeout(() => {
      // 1.6秒後にアンケートページへ遷移
      navigate("/survey");
    }, 1600);
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }} // 初期表示は透明
      animate={{ opacity: 1 }} // フェードイン
      exit={{ opacity: 0 }} // フェードアウト
      transition={{ duration: 1.5, delay: 1 }}
    >
      {/* 左上ロゴボタン */}
      <img
        src={logo}
        alt="CBBS ロゴ"
        className={styles.logo}
        onClick={() => navigate("/")}
      />

      {/* タイトル・サブタイトル */}
      <h1 className={styles.title}>CBBS アンケート</h1>
      <p className={styles.subtitle}>LINE のお友達募集中</p>

      {/* LINE QRコード表示 */}
      <img src={qr} alt="LINE QRコード" className={styles.qr} />

      {/* アンケート開始ボタン */}
      <button
        className={styles.startButton}
        onClick={handleStart}
      >
        アンケートに答える
      </button>

      {/* 読み込み中オーバーレイ */}
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

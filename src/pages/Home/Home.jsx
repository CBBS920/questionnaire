import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Home.module.css";
import qr from "../../img/line_qr.png";
import mizuho from "../../img/mizuho8327.png";
import logo from "../../img/CBBS_2.png";

const Home = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // スタートボタン → モーダル表示
  const handleStart = () => {
    setShowPopup(true);
  };

  // 登録完了 → ローディング経由でアンケートへ
  const handleRegisterComplete = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/survey");
    }, 1500);
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      {/* 左上ロゴ */}
      <img
        src={logo}
        alt="CBBS ロゴ"
        className={styles.logo}
        onClick={() => navigate("/")}
      />

      {/* タイトル */}
      <h1 className={styles.title}>CBBS アンケート</h1>

      {/* MIZUHO 画像（ポップアニメーション付き） */}
      <motion.img
        src={mizuho}
        alt="MIZUHO"
        className={styles.mizuhoImage}
        animate={{
          y: [0, -10, 0], // 上下に軽く動く
          scale: [1, 1.05, 1], // ふわっと膨らむ
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* スタートボタン */}
      <button className={styles.startButton} onClick={handleStart}>
        スタート
      </button>

      {/* モーダル（LINE登録） */}
      {showPopup && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.appear}`}>
            {/* ✨ 右上の閉じるボタン */}
            <button
              className={styles.closeTopRight}
              onClick={() => setShowPopup(false)} // ← 修正
            >
              ×
            </button>

            <div className={styles.modalContent}>
              <p className={styles.modalMessage}>LINE のお友達募集中！</p>
              <p className={styles.modalContent}>
                登録が完了したらボタンを押して、次に進んでね！
                <br />
                既に登録している人もボタンを押して、次に進んでね！
              </p>

              <img src={qr} alt="LINE QRコード" className={styles.qrImage} />

              <div className={styles.modalButtons}>
                <button
                  className={styles.registerButton}
                  onClick={handleRegisterComplete}
                >
                  登録完了
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* クレジット表示（右下固定） */}
      <div className={styles.credit}>
        公式アンバサダー　元ZONE MIZUHO　提供：株式会社アークライズ&emsp;
        <a href="https://www.arcrise-inc.jp/" target="_blank" rel="noopener noreferrer">
          https://www.arcrise-inc.jp/
        </a>
      </div>

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

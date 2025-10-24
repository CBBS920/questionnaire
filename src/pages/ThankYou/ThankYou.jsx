import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./ThankYou.module.css";
import logo from "../../img/CBBS_2.png";

// アンケート終了画面
const ThankYou = () => {
  const navigate = useNavigate();
  // クラッカー用の配列
  const [confettiArray, setConfettiArray] = useState([]);

  useEffect(() => {
    // 画面表示後すぐにクラッカー（コンフェッティ）を作成
    const confettiCount = 100;
    const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#43aa8b", "#577590"]; // 色の配列

    // 各コンフェッティの位置・色・サイズ・遅延をランダム生成
    const confettis = Array.from({ length: confettiCount }).map(() => {
      // 左右位置
      const x = Math.floor(Math.random() * window.innerWidth) + "px";
      // アニメーション遅延
      const delay = Math.random() * 2 + "s";
      // 色ランダム
      const color = colors[Math.floor(Math.random() * colors.length)];
      // サイズランダム
      const size = Math.random() * 12 + 6 + "px";
      return { x, delay, color, size };
    });

    setConfettiArray(confettis);

    // 3.1秒後にコンフェッティを消す
    const timer = setTimeout(() => setConfettiArray([]), 3100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}  // フェードイン開始
      animate={{ opacity: 1 }}  // フェードイン終了
      exit={{ opacity: 0 }}     // ページ離脱時フェードアウト
      transition={{ duration: 1.5, delay: 1 }}
    >
      {/* 左上ロゴボタン */}
      <img
        src={logo}
        alt="CBBS ロゴ"
        className={styles.logo}
        onClick={() => navigate("/")}
      />

      {/* コンフェッティ */}
      {confettiArray.length > 0 && (
        <div className={styles.confetti}>
          {confettiArray.map((c, index) => (
            <span
              key={index}
              style={{
                left: c.x,
                backgroundColor: c.color,
                width: c.size,
                height: c.size,
                animationDelay: c.delay,
                '--x': (Math.random() * 200 - 100) + "px" // 左右ランダムに飛ばす
              }}
            ></span>
          ))}
        </div>
      )}

      {/* 終了メッセージ */}
      <h1 className={styles.title}>ご協力ありがとうございました！</h1>

      {/* 最初に戻るボタン */}
      <button className={styles.button} onClick={() => navigate("/")}>
        最初に戻る
      </button>
    </motion.div>
  );
};

export default ThankYou;

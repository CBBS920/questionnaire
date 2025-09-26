import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./ThankYou.module.css";
import logo from "../../img/CBBS_2.png";

const ThankYou = () => {
  const navigate = useNavigate();
  const [confettiArray, setConfettiArray] = useState([]);

  useEffect(() => {
    // 画面表示後すぐにクラッカー表示
    const confettiCount = 100;
    const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];
    const confettis = Array.from({ length: confettiCount }).map(() => {
      const x = Math.floor(Math.random() * window.innerWidth) + "px";
      const delay = Math.random() * 2 + "s";
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 12 + 6 + "px";
      return { x, delay, color, size };
    });
    setConfettiArray(confettis);

    const timer = setTimeout(() => setConfettiArray([]), 3100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 1 }}
    >
      <img
        src={logo}
        alt="CBBS ロゴ"
        className={styles.logo}
        onClick={() => navigate("/")}
      />

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
                '--x': (Math.random() * 200 - 100) + "px" // 左右ランダムに飛ぶ
              }}
            ></span>
          ))}
        </div>
      )}

      <h1 className={styles.title}>ご協力ありがとうございました！</h1>
      <button className={styles.button} onClick={() => navigate("/")}>
        最初に戻る
      </button>
    </motion.div>
  );
};

export default ThankYou;

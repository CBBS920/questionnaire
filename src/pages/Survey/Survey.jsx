import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../img/CBBS_2.png";
import one from "../../img/mizuho8186.png";
import two from "../../img/mizuho8326.png";
import three from "../../img/mizuho8379.png";
import four from "../../img/mizuho8560.png";
import five from "../../img/mizuho8142.png";
import six from "../../img/mizuho8473.png";
import seven from "../../img/mizuho8218.png";
import styles from "./Survey.module.css";

// アンケート質問データ
const questions = [
  { id: 1, text: "お住まいは川根本町内ですか？町外ですか？", type: "radio", options: ["町内", "町外"] },
  { id: 2, text: "あなたの年代は？", type: "radio", options: ["10代", "20代", "30代", "40代", "50代", "51歳以上"] },
  { id: 3, text: "インターネットの契約はどこですか？", type: "radio", options: ["ADSL", "ホームルーター", "ポケットWi-Fi", "やませみネット", "かわせみねっと", "なし"] },
  { id: 4, text: "あなたのスマホの月額料金はいくらですか？", type: "radio", options: ["2000円未満", "2000円～5000円", "5001円以上", "わからない"] },
  { id: 5, text: "ポケットWi-Fi（モバイルルーター）を持っていますか？", type: "radio", options: ["はい", "いいえ"] },
  { id: 6, text: "全キャリア（au, docomo, SoftBank）が使えるポケットWi-Fiを使ってみたいですか？", type: "radio", options: ["はい", "いいえ", "どちらともいえない"] },
  { id: 7, text: "スマホやパソコン、ネットで困ってることありますか？", type: "checkbox", options: ["料金が高い", "繋がりにくい", "操作がわからない", "とくに困っていない", "その他"] },
  { id: 8, text: "スマホやパソコン、ネット困ってることを相談できる人がいますか？", type: "radio", options: ["はい", "いいえ"] },
  { id: 9, text: "CBBSのキャンペーンのプレゼントは何がいいですか", type: "radio", options: ["お値下げ（月額費など）", "訪問サポート無料", "金券", "機器（ルーターなど）", "食品", "その他"] },
  { id: 10, text: "川根本町内にどんな施設やサービスがあったらいいですか？", type: "checkbox", options: ["コインランドリー", "ホームセンター", "満喫", "カラオケ", "ゲームセンター", "ドラッグストア", "お弁当屋", "カフェ", "携帯ショップ", "100円ショップ", "家事代行", "引越業者", "ビジネスホテル", "その他"] },
  { id: 11, text: "産業祭で一番興味のあるブースはどれですか？", type: "radio", options: ["ミニゲーム", "飲食", "体験", "その他"] },
  { id: 12, text: "その他ご意見があれば！", type: "text" }
];

// アンケート画面コンポーネント
const Survey = () => {
  // ステート管理
  const [step, setStep] = useState(0);                 // 現在の質問番号
  const [answers, setAnswers] = useState({});          // 回答内容
  const [showError, setShowError] = useState(false);   // エラーモーダル表示
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージ文言
  const [otherInputs, setOtherInputs] = useState({});  // 「その他」入力内容
  const [loading, setLoading] = useState(false);       // ローディング状態
  const navigate = useNavigate();

  // ページ番号とランダム画像設定
  const pages = Array.from({ length: questions.length }, (_, i) => i + 1);
  const pageImages = [one, two, three, four, five];
  const getRandomImage = () => pageImages[Math.floor(Math.random() * pageImages.length)];
  const [pageImagesByStep] = useState(pages.map(() => getRandomImage()));

  // ✅ 回答変更時処理
  const handleChange = (e, q) => {
    if (q.type === "checkbox") {
      // チェックボックス：選択追加または削除
      setAnswers(prev => {
        const arr = prev[q.id] || [];
        if (e.target.checked) {
          return { ...prev, [q.id]: [...arr, e.target.value] };
        } else {
          return { ...prev, [q.id]: arr.filter(v => v !== e.target.value) };
        }
      });
    } else {
      // ラジオ・テキスト：単一選択
      setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
    }
  };

  // ✅ 「進む」ボタンクリック時
  const handleNext = () => {
    const q = questions[step];
    const ans = answers[q.id];

    // --- 入力チェック ---
    // 未回答時
    if (
      (q.type === "radio" && !ans) ||
      (q.type === "checkbox" && (!ans || ans.length === 0)) ||
      (q.type === "text" && q.id !== 12 && (!ans || ans.trim() === ""))
    ) {
      setErrorMessage("どれか一つ選んでね！");
      setShowError(true);
      return;
    }

    // 「その他」選択時に未入力ならエラー
    const isOtherSelected =
      (Array.isArray(ans) && ans.includes("その他")) ||
      ans === "その他";
    if (isOtherSelected && (!otherInputs[q.id] || otherInputs[q.id].trim() === "")) {
      setErrorMessage("入力してね！");
      setShowError(true);
      return;
    }

    // --- 最後の質問でなければ次へ ---
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    // --- 最終送信処理 ---
    const finalAnswers = { ...answers };
    Object.keys(otherInputs).forEach(qid => {
      const answer = finalAnswers[qid];
      if (Array.isArray(answer)) {
        finalAnswers[qid] = answer.map(ans =>
          ans === "その他" ? `${ans}: ${otherInputs[qid]}` : ans
        );
      } else if (answer === "その他") {
        finalAnswers[qid] = `その他: ${otherInputs[qid]}`;
      }
    });

    // サーバー送信処理
    setLoading(true);
    fetch("http://localhost:5000/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalAnswers)
    })
      .then(res => res.json())
      .finally(() => {
        setLoading(false);
        navigate("/thankyou"); // サンクスページへ
      });
  };

  const q = questions[step]; // 現在の質問を取得

  return (
    <div className={styles.container}>
      {/* 左上ロゴ（クリックでトップへ） */}
      <img
        src={logo}
        alt="CBBS ロゴ"
        className={styles.logo}
        onClick={() => navigate("/")}
      />

      {/* ページインジケーター（上部のページ番号＋画像） */}
      <div className={styles.pageIndicator}>
        {pages.map(num => (
          <div key={num} className={num === step + 1 ? styles.activePage : styles.inactivePage}>
            <div className={styles.pageContainer}>
              {num}
              {num === step + 1 && (
                <div className={styles.pageImageWrapper}>
                  <img
                    src={step === 11 ? six : pageImagesByStep[step]}
                    alt={`Question ${num}`}
                    className={styles.pageImage}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 質問テキスト */}
      <h2 className={styles.questionText}>{q.text}</h2>

      {/* 選択肢エリア */}
      <div className={`${styles.options} ${q.options && q.options.length >= 8 ? styles.twoColumn : ""}`}>
        {/* ラジオボタン */}
        {q.type === "radio" &&
          q.options.map(opt => (
            <div key={opt} className={styles.optionItem}>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={e => handleChange(e, q)}
                />
                {opt}
              </label>
              {/* その他の入力欄 */}
              {opt === "その他" && answers[q.id] === "その他" && (
                <input
                  type="text"
                  placeholder="具体的に入力してください"
                  className={styles.otherInput}
                  value={otherInputs[q.id] || ""}
                  onChange={e =>
                    setOtherInputs(prev => ({ ...prev, [q.id]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}

        {/* チェックボックス */}
        {q.type === "checkbox" &&
          q.options.map(opt => (
            <div key={opt} className={styles.optionItem}>
              <label>
                <input
                  type="checkbox"
                  value={opt}
                  checked={answers[q.id]?.includes(opt) || false}
                  onChange={e => handleChange(e, q)}
                />
                {opt}
              </label>
              {/* その他の入力欄 */}
              {opt === "その他" && answers[q.id]?.includes("その他") && (
                <input
                  type="text"
                  placeholder="具体的に入力してください"
                  className={styles.otherInput}
                  value={otherInputs[q.id] || ""}
                  onChange={e =>
                    setOtherInputs(prev => ({ ...prev, [q.id]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}

        {/* 自由記述 */}
        {q.type === "text" && (
          <textarea
            className={styles.textarea}
            onChange={e => handleChange(e, q)}
          />
        )}
      </div>

      {/* 次へ/送信ボタン */}
      <button className={styles.nextButton} onClick={handleNext}>
        {step === questions.length - 1 ? "送信" : "進む"}
      </button>

      {/* クレジット表示（右下固定） */}
      <div className={styles.credit}>
        公式アンバサダー　元ZONE MIZUHO　提供：株式会社アークライズ&emsp;
        <a href="https://www.arcrise-inc.jp/" target="_blank" rel="noopener noreferrer">
          https://www.arcrise-inc.jp/
        </a>
      </div>

      {/* エラーモーダル（「どれか選んでね」「入力してね」に対応） */}
      {showError && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.appear}`}>
            <div className={styles.modalContent}>
              <p className={styles.modalMessage}>{errorMessage}</p>
              <img
                src={seven}
                alt="エラーメッセージ画像"
                className={styles.errorImage}
              />
              <button
                className={styles.closeButton}
                onClick={() => setShowError(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 送信中ローディング画面 */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>送信中.....</p>
        </div>
      )}
    </div>
  );
};

export default Survey;

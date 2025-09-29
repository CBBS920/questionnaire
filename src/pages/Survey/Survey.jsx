import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../img/CBBS_2.png";
import one from "../../img/mizuho8186.png";
import two from "../../img/mizuho8326.png";
import three from "../../img/mizuho8379.png";
import four from "../../img/mizuho8560.png";
import five from "../../img/mizuho8142.png";
import six from "../../img/mizuho8473.png";
import styles from "./Survey.module.css";

const questions = [
  { id: 1, text: "お住まいは川根本町内ですか？町外ですか？", type: "radio", options: ["町内", "町外"] },
  { id: 2, text: "あなたの年代は？", type: "radio", options: ["10代", "20代", "30代", "40代", "50代", "51歳以上"] },
  { id: 3, text: "インターネットの契約はどこですか？", type: "radio", options: ["ADSL", "やませみネット", "ホームルーター", "かわせみねっと", "なし"] },
  { id: 4, text: "あなたのスマホの月額料金はいくらですか？", type: "radio", options: ["2000円未満", "2000円～5000円", "5001円以上", "わからない"] },
  { id: 5, text: "ポケットWi-Fi（モバイルルーター）を持っていますか？", type: "radio", options: ["はい", "いいえ"] },
  { id: 6, text: "全キャリア（au docomo SoftBank）を使えるポケットWi-Fiを使ってみたいですか？", type: "radio", options: ["はい", "いいえ", "どちらともいえない"] },
  { id: 7, text: "スマホ、パソコンやネットで困ってることありますか？", type: "checkbox", options: ["料金が高い", "繋がりにくい", "操作がわからない", "とくに困っていない", "その他"] },
  { id: 8, text: "スマホ、パソコンやネット困ってることを相談できる人がいますか？", type: "radio", options: ["はい", "いいえ"] },
  { id: 9, text: "CBBSのキャンペーンのプレゼントは何がいいですか", type: "radio", options: ["値下げ（月額費など）", "訪問サポート無料", "金券", "機器（ルーターなど）", "食品", "その他"] },
  { id: 10, text: "川根本町内にどんな施設やサービスがあったらいいですか？", type: "checkbox", options: ["コインランドリー", "ホームセンター", "満喫", "カラオケ", "ゲームセンター", "ドラッグストア", "お弁当屋", "カフェ", "携帯ショップ", "100円ショップ", "家事代行", "引越業者", "ビジネスホテル", "その他"] },
  { id: 11, text: "産業祭で一番興味のあるブースはどれですか？", type: "radio", options: ["ミニゲーム", "飲食", "体験", "その他"] },
  { id: 12, text: "その他ご意見があれば！", type: "text" }
];

// アンケート画面
const Survey = () => {
  const [step, setStep] = useState(0);             // 現在の質問ステップ
  const [answers, setAnswers] = useState({});      // 各質問の回答を保存
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const pages = Array.from({ length: questions.length }, (_, i) => i + 1);

  const pageImages = [one, two, three, four, five];

  // ランダム選択関数を用意
  const getRandomImage = () => {
    const index = Math.floor(Math.random() * pageImages.length);
    return pageImages[index];
  };

  // コンポーネント内
  const [pageImagesByStep] = useState(
    pages.map(() => getRandomImage())
  );


  // 回答変更時の処理
  const handleChange = (e, q) => {
    if (q.type === "checkbox") {
      // チェックボックスの場合、複数回答を配列で管理
      setAnswers(prev => {
        const arr = prev[q.id] || [];
        if (e.target.checked) {
          return { ...prev, [q.id]: [...arr, e.target.value] };
        } else {
          return { ...prev, [q.id]: arr.filter(v => v !== e.target.value) };
        }
      });
    } else {
      // ラジオボタンやテキストの場合は単一値で管理
      setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
    }
  };

  // 「その他」の入力用state
  const [otherInputs, setOtherInputs] = useState({});

  const handleNext = () => {
    const q = questions[step];
    const ans = answers[q.id];

    // 未入力チェック
    if (
      (q.type === "radio" && !ans) ||
      (q.type === "checkbox" && (!ans || ans.length === 0)) ||
      (q.type === "text" && q.id !== 12 && (!ans || ans.trim() === ""))
    ) {
      setShowError(true);
      return;
    }

    // 最終ステップ以外は次の質問に進む
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    // 最終ステップの場合、送信処理
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

    // ローディングON
    setLoading(true);

    // サーバー送信
    fetch("http://localhost:5000/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalAnswers)
    })
      .then(res => res.json()) // 必要に応じてレスポンス取得
      .finally(() => {
        setLoading(false);        // ローディングOFF
        navigate("/thankyou");    // サンクスページへ
      });
  };


  const q = questions[step];

  return (
    <div
      className={styles.container}

    >
      {/* 左上ロゴ */}
      <img
        src={logo}
        alt="CBBS ロゴ"
        className={styles.logo}
        onClick={() => navigate("/")}
      />

      {/* ページ数インジケーター（画面上部中央） */}
      <div className={styles.pageIndicator}>
        {pages.map(num => (
          <div key={num} className={num === step + 1 ? styles.activePage : styles.inactivePage}>
            {num}
            {num === step + 1 && (
              <img
                src={step === 11 ? six : pageImagesByStep[step]} // ← 12問目ならsix、それ以外はランダム画像
                alt={`Question ${num}`}
                className={styles.pageImage}
              />
            )}
          </div>
        ))}
      </div>

      <h2 className={styles.questionText}>{q.text}</h2>

      <div
        className={`${styles.options} ${q.options && q.options.length >= 8 ? styles.twoColumn : ""
          }`}
      >
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

              {/* ラジオボタンの「その他」入力欄 */}
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

        {q.type === "checkbox" &&
          q.options.map(opt => (
            <div key={opt} className={styles.optionItem}>
              <label>
                <input
                  type="checkbox"
                  value={opt}
                  onChange={e => handleChange(e, q)}
                />
                {opt}
              </label>

              {/* チェックボックスの「その他」入力欄 */}
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

      {/* エラーモーダル */}
      {showError && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <span>エラー</span>
              <button
                className={styles.closeButton}
                onClick={() => setShowError(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              どれか一つ選んでね！
            </div>
          </div>
        </div>
      )}

      {/* 読み込み中オーバーレイ */}
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

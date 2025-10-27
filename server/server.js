import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Gmail送信設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cbbs0202@gmail.com",           // 送信用Gmailアドレス
    pass: "fzpa hbxh tuyi jqgj",         // アプリパスワード
  },
});

const questions = [
  "お住まいは川根本町内ですか？町外ですか？",
  "あなたの年代は？",
  "インターネットの契約はどこですか？",
  "あなたのスマホの月額料金はいくらですか？",
  "ポケットWi-Fi（モバイルルーター）を持っていますか？",
  "全キャリア（docomo, SoftBank, au）が使えるポケットWi-Fiを使ってみたいですか？",
  "スマホやパソコン、ネットで困っていることはありますか？",
  "スマホやパソコン、ネット困っていることを相談できる人がいますか？",
  "CBBSのキャンペーンで嬉しい特典はどれですか？",
  "川根本町内にどんな施設やサービスがあったらいいですか？",
  "産業祭で一番興味のあるブースはどれですか？",
  "その他ご意見があれば！"
];

app.post("/api/survey", async (req, res) => {
  const answers = req.body;

  // メール本文を質問ごとに整形
  const mailBody = Object.entries(answers)
    .map(([id, ans]) => {
      let answerText = "";
      if (Array.isArray(ans)) {
        answerText = ans.join(", "); // チェックボックスはカンマ区切り
      } else {
        answerText = ans;
      }

      const questionIndex = parseInt(id) - 1;
      const questionText = questions[questionIndex] || `質問ID ${id}`;

      return `■ ${questionText}\n${answerText}\n`;
    })
    .join("\n");

  const mailOptions = {
    from: "cbbs0202@gmail.com",     // 送信用Gmailアドレス
    to: "cbbs0202@gmail.com",       // 受信先
    subject: "CBBSアンケート回答",
    text: mailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("送信成功");
  } catch (error) {
    console.error(error);
    res.status(500).send("送信エラー: " + error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

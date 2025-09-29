import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Survey from "./pages/Survey/Survey";
import ThankYou from "./pages/ThankYou/ThankYou";

const App = () => {
  // 現在のURLパスを取得（アニメーションや再レンダリング制御に使用可能）
  const location = useLocation(); 
  
  return (
    <Routes location={location} key={location.pathname}>
      {/* ホームページ */}
      <Route path="/" element={<Home />} />
      
      {/* アンケートページ */}
      <Route path="/survey" element={<Survey />} />
      
      {/* 送信完了ページ */}
      <Route path="/thankyou" element={<ThankYou />} />
    </Routes>
  );
};

export default App;

import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Survey from "./pages/Survey/Survey";
import ThankYou from "./pages/ThankYou/ThankYou";

const App = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/thankyou" element={<ThankYou />} />
    </Routes>
  );
};

export default App;

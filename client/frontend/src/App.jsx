import { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  //  vd: const Trangchu = lazy(() => import("./components/Home/Trangchu"));

  return (
    <Router>
      <Suspense fallback={<div>Đang tải...</div>}>
        <Routes>
                   {/* <Route path="/home" element={<Trangchu />} /> */}

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

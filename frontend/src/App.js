import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./styles/App.css";
import MainPage from "./admin/main";
import { useEffect, useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

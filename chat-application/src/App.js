import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";


import Home from "./components/Home";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Chat from "./components/Chat";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login  setUser={setUser}/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chat" element={user ? <Chat user={user} /> : <Login setUser={setUser} />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

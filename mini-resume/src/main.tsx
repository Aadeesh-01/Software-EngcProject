import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Builder from "./App";
import AuthPage from "./pages/AuthPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/builder/:id" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

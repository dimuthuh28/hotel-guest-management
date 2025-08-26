import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GuestList from "./pages/GuestList.tsx";
import AddGuestForm from "./pages/AddGuestForm.tsx";
import GuestDetail from "./pages/GuestDetail";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/guests" replace />} />
        <Route path="/guests" element={<GuestList />} />
        <Route path="/guests/new" element={<AddGuestForm />} />
        <Route path="/guests/:id" element={<GuestDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

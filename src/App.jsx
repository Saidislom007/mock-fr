// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Reading from "./pages/Reading";
import Writing from "./pages/Writing";
import SpeakingPage from "./pages/Speaking";
import Listening from "./pages/Listening";
import MarketPage from "./pages/MarketPage";

// Components
import TextHighlighter from "./components/HighlightableText";
import Parent from "./components/Parent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

        {/* Private routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/reading"
          element={
            <PrivateRoute>
              <Reading />
            </PrivateRoute>
          }
        />
        <Route
          path="/writing"
          element={
            <PrivateRoute>
              <Writing />
            </PrivateRoute>
          }
        />
        <Route
          path="/speaking"
          element={
            <PrivateRoute>
              <SpeakingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/listening"
          element={
            <PrivateRoute>
              <Listening />
            </PrivateRoute>
          }
        />

        {/* Optional / extra pages */}
        <Route
          path="/market"
          element={
            <PrivateRoute>
              <MarketPage />
            </PrivateRoute>
          }
        />
        {/* Agar Parent component ishlatilsa */}
        {/* <Route path="/parent" element={<Parent />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

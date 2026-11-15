import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CreatorProvider, useCreator } from "./context/CreatorContext";
import AppLayout from "./components/layout/AppLayout";
import KanbanBoard from "./components/board/KanbanBoard";
import CalendarView from "./components/views/CalendarView";
import AnalyticsView from "./components/views/AnalyticsView";
import HookBankView from "./components/views/HookBankView";
import AuthView from "./components/views/AuthView";

function ProtectedRoute({ children }) {
  const { token } = useCreator();
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { token } = useCreator();
  if (token) {
    return <Navigate to="/board" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <CreatorProvider>
        <Routes>
          {/* Giriş / Kayıt Sayfası */}
          <Route
            path="/auth"
            element={
              <PublicOnlyRoute>
                <AuthView />
              </PublicOnlyRoute>
            }
          />

          {/* Korumalı Ana Uygulama Rotaları */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/board" replace />} />
            <Route path="board" element={<KanbanBoard />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="hooks" element={<HookBankView />} />
          </Route>

          <Route path="*" element={<Navigate to="/board" replace />} />
        </Routes>
      </CreatorProvider>
    </BrowserRouter>
  );
}

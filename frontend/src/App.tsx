import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./pages/LoginPage";
import { FeedPage } from "./pages/FeedPage";
import { CreatePostPage } from "./pages/CreatePostPage";
import { SettingsPage } from "./pages/SettingsPage";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<div className="p-4">Not found</div>} />
      </Routes>
    </Layout>
  );
}

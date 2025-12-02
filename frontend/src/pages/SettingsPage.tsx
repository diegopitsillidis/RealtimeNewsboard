import { useSettingsStore } from "../store/settingsStore";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

export const SettingsPage = () => {
  const { token } = useAuthStore();
  const {
    theme,
    language,
    defaultCategory,
    setTheme,
    setLanguage,
    setDefaultCategory,
  } = useSettingsStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold">User Settings</h1>

      {/* Theme */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Theme</h2>
        <select
          className="border rounded px-2 py-1"
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </section>

      {/* Language */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Language</h2>
        <select
          className="border rounded px-2 py-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
          {/* #todo? */}
      </section>

      {/* Default category */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Default category</h2>
        <select
          className="border rounded px-2 py-1"
          value={defaultCategory}
          onChange={(e) => setDefaultCategory(e.target.value)}
        >
          <option>General</option>
          <option>Sports</option>
          <option>Tech</option>
          <option>Finance</option>
        </select>
        <p className="text-xs text-gray-500">
          Used as default on Feed and Create Post.
        </p>
      </section>
    </div>
  );
};

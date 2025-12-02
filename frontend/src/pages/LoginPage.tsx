import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Navigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth, token } = useAuthStore();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");

  const mutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (data) => {
      setAuth(data);
      navigate("/feed");
    },
  });

  if (token) {
    // Already logged in
    return <Navigate to="/feed" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-600">
            Invalid username or password.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        Test users:
        <br />
        admin / admin123
        <br />
        user / user123
      </p>
    </div>
  );
};

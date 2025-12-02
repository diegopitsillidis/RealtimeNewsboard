import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const Navbar = () => {
  const { token, username, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname.startsWith(path) ? "font-bold" : "";

  return (
    <header className="border-b mb-4">
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex gap-4 items-center">
          <span className="font-semibold">Realtime Newsboard</span>
          {token && (
            <>
              <Link to="/feed" className={isActive("/feed")}>
                Feed
              </Link>
              <Link to="/create" className={isActive("/create")}>
                Create
              </Link>
              <Link to="/settings" className={isActive("/settings")}>
                Settings
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {token ? (
            <>
              <span className="text-sm text-gray-600">Hi, {username}</span>
              <button
                onClick={handleLogout}
                className="text-sm border rounded px-2 py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={isActive("/login")}>
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

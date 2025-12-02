// import { ReactNode, useEffect } from "react";
// import { Navbar } from "./Navbar";
// import { useSettingsStore } from "../../store/settingsStore";

// type Props = {
//   children: ReactNode;
// };

// export const Layout = ({ children }: Props) => {
//   const { theme, loadFromStorage } = useSettingsStore();

//   // load settings once
//   useEffect(() => {
//     loadFromStorage();
//   }, [loadFromStorage]);

//   // apply theme to <body>
//   useEffect(() => {
//     if (theme === "dark") {
//       document.body.classList.add("theme-dark");
//       document.body.classList.remove("theme-light");
//     } else {
//       document.body.classList.add("theme-light");
//       document.body.classList.remove("theme-dark");
//     }
//   }, [theme]);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1 max-w-4xl mx-auto w-full">{children}</main>
//     </div>
//   );
// };
import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { useSettingsStore } from "../../store/settingsStore";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  const { theme, loadFromStorage } = useSettingsStore();

  // Load settings once
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Apply Tailwind dark mode class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
};

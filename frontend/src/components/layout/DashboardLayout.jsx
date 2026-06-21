import { useState } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import GlobalSearch from "./GlobalSearch";
import useScrollToHash from "@/hooks/useScrollToHash";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? "md:ml-[60px]" : "md:ml-[230px]";
  const sidebarLeft = collapsed ? "md:left-[60px]" : "md:left-[230px]";

  // Smooth-scrolls to `#section` when navigated to via the global search
  useScrollToHash();

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/*
        Fixed top bar. Solid background so page content scrolls UP TO it
        (and stops there) instead of disappearing behind/around it.
      */}
      <header
        className={`fixed top-0 left-0 right-0 ${sidebarLeft} h-[73px] z-40 flex items-center justify-center px-4 bg-light-bg dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border transition-all duration-300`}
      >
        <GlobalSearch />
      </header>

      <main
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${sidebarWidth} pb-20 md:pb-0 pt-[73px]`}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
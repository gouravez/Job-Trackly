import { useState } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? "md:ml-[60px]" : "md:ml-[230px]";

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${sidebarWidth} pb-20 md:pb-0`}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

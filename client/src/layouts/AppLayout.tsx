import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { MobileNav } from "../components/MobileNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar />
      <MobileNav />
      <div className="md:pl-60">
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

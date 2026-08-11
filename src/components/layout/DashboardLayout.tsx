import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { MobileTabBar } from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}

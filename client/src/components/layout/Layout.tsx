import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuthStore, useAppStore } from '../../store';

export default function Layout() {
  const { isAuthenticated } = useAuthStore();
  const { sidebarOpen } = useAppStore();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#0D1117' }}>
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '260px' : '0' }}
      >
        <TopBar />
        <main className="w-full max-w-[1200px] mx-auto px-[5%] py-[80px] pt-[calc(80px+64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { MobileMenu } from './MobileMenu';
import { Toaster } from './ui/sonner';
import { useState, useEffect } from 'react';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle menu click from Menu tab
  useEffect(() => {
    if (location.pathname === '/menu') {
      setIsMobileMenuOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
      {/* 
        Mobile: pt-14 (56px header) + pb-20 (80px bottom nav) + safe areas
        Desktop: mt-16 (64px header) + ml-64 (256px sidebar)
      */}
      <main className="min-h-[calc(100vh-56px-80px)] pb-20 pt-14 lg:mb-0 lg:ml-64 lg:min-h-0 lg:pb-0 lg:pt-16">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
      <MobileNav />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <Toaster />
    </div>
  );
}
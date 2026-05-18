import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  Menu,
} from 'lucide-react';
import { cn } from './ui/utils';

const mobileMenuItems = [
  { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/invoices', label: 'Hóa đơn', icon: FileText },
  { path: '/debts', label: 'Công nợ', icon: CreditCard },
  { path: '/customers', label: 'Khách hàng', icon: Users },
  { path: '/menu', label: 'Menu', icon: Menu },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white pb-safe lg:hidden">
      <div className="grid grid-cols-5">
        {mobileMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-[#1E88E5]'
                  : 'text-gray-600'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive && 'text-[#1E88E5]')} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
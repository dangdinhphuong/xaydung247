import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  CreditCard,
  Users,
  Package,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from './ui/utils';
import { useState } from 'react';
import { Button } from './ui/button';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/invoices', label: 'Hóa đơn', icon: FileText },
  { path: '/quotations', label: 'Báo giá', icon: FileCheck },
  { path: '/debts', label: 'Công nợ', icon: CreditCard },
  { path: '/customers', label: 'Khách hàng', icon: Users },
  { path: '/products', label: 'Mặt hàng', icon: Package },
  { path: '/reports', label: 'Báo cáo', icon: BarChart3 },
  { path: '/settings', label: 'Cài đặt', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 hidden h-screen border-r bg-white transition-all duration-300 lg:block',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-6">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E88E5]">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Invoice Pro</h1>
              <p className="text-xs text-gray-500">Quản lý hóa đơn</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E88E5]">
            <FileText className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#1E88E5] text-white'
                  : 'text-gray-700 hover:bg-gray-100',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Thu gọn</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
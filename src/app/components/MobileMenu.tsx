import { Link, useLocation } from 'react-router';
import {
  FileCheck,
  Package,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';

const additionalMenuItems = [
  { path: '/quotations', label: 'Báo giá', icon: FileCheck },
  { path: '/products', label: 'Mặt hàng', icon: Package },
  { path: '/reports', label: 'Báo cáo', icon: BarChart3 },
  { path: '/settings', label: 'Cài đặt', icon: Settings },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white pb-20 lg:hidden">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="font-semibold text-gray-900">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col gap-1 p-4">
          {additionalMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-4 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#1E88E5] text-white'
                    : 'text-gray-700 active:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
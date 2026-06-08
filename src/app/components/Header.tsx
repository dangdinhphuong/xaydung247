import { Search, User, Menu as MenuIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../auth/AuthContext';
import type { Role } from '../types';

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Quản trị viên',
  ACCOUNTANT: 'Kế toán',
  SALES: 'Nhân viên bán hàng',
  VIEWER: 'Chỉ xem',
};

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-20 h-14 border-b bg-white lg:left-64 lg:h-16">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex flex-1 items-center gap-2 lg:gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="relative hidden w-full max-w-md md:block lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm hóa đơn, khách hàng..."
              className="pl-10"
            />
          </div>

          {/* Mobile Search Icon */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88E5] text-white">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden text-left md:block">
                  <div className="text-sm font-medium">{user?.fullName ?? 'Người dùng'}</div>
                  <div className="text-xs text-gray-500">{user ? ROLE_LABELS[user.role] : ''}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>{user?.fullName}</div>
                <div className="text-xs font-normal text-gray-500">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>Cài đặt</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
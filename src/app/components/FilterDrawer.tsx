import { X, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function FilterDrawer({
  isOpen,
  onClose,
  statusFilter,
  onStatusChange,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white pb-20 md:hidden">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#1E88E5]" />
            <h2 className="font-semibold text-gray-900">Bộ lọc</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <Label>Trạng thái hóa đơn</Label>
            <Select value={statusFilter} onValueChange={(value) => onStatusChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                <SelectItem value="partial">Thanh toán một phần</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                onStatusChange('all');
              }}
              className="flex-1"
            >
              Đặt lại
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-[#1E88E5] hover:bg-[#1976D2]"
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
import { AlertCircle, Inbox, Loader2, ShieldOff } from 'lucide-react';
import { ApiError } from '../api/client';
import { Button } from './ui/button';
import { getErrorMessage } from '../lib/errors';

export function LoadingState({ label = 'Đang tải...' }: { label?: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-500">
      <Loader2 className="h-8 w-8 animate-spin text-[#1E88E5]" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  message = 'Không có dữ liệu',
  icon: Icon = Inbox,
}: {
  message?: string;
  icon?: typeof Inbox;
}) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-400">
      <Icon className="h-12 w-12" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const isForbidden = error instanceof ApiError && error.status === 403;
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
      {isForbidden ? (
        <ShieldOff className="h-12 w-12 text-orange-400" />
      ) : (
        <AlertCircle className="h-12 w-12 text-red-400" />
      )}
      <p className="text-sm text-gray-600">
        {isForbidden
          ? 'Bạn không có quyền xem nội dung này'
          : getErrorMessage(error)}
      </p>
      {onRetry && !isForbidden && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}

import { FileQuestion } from 'lucide-react';
import { Button } from '../components/ui/button';
import { FilteredLink } from '../components/FilteredLink';

export default function NotFound() {
  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <FileQuestion className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-gray-900">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-gray-700">
          Không tìm thấy trang
        </h2>
        <p className="mt-2 text-gray-500">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Button asChild className="mt-6 bg-[#1E88E5] hover:bg-[#1976D2]">
          <FilteredLink to="/">Về trang chủ</FilteredLink>
        </Button>
      </div>
    </div>
  );
}
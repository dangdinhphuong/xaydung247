import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { cn } from './ui/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  trend,
}: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 lg:text-3xl">{value}</p>
            {trend && (
              <p className="mt-2 text-sm">
                <span
                  className={cn(
                    'font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.value}
                </span>
                <span className="text-gray-500"> so với tháng trước</span>
              </p>
            )}
          </div>
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg bg-opacity-10 lg:h-12 lg:w-12',
              iconColor.replace('text-', 'bg-')
            )}
          >
            <Icon className={cn('h-5 w-5 lg:h-6 lg:w-6', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { ReactNode } from 'react';
import Card from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-royal-600">{icon}</div>}
      </div>
    </Card>
  );
}
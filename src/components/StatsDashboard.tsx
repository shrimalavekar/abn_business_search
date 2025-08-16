import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { BusinessData } from '@/types/business';
import { Building2, MapPin, TrendingUp, Users, Activity, Calendar, Clock } from 'lucide-react';

interface StatsDashboardProps {
  data: BusinessData[];
  filteredCount: number;
}

export function StatsDashboard({ data, filteredCount }: StatsDashboardProps) {
  // Calculate statistics from the data
  const stats = {
    totalEntities: filteredCount,
    activeEntities: data.filter(item => item.status === 'ACT').length,
    inactiveEntities: data.filter(item => item.status === 'CAN').length,
    uniqueStates: new Set(data.map(item => item.state)).size,
    uniqueEntityTypes: new Set(data.map(item => item.entity_type)).size,
    averageAbnLength: data.length > 0 
      ? Math.round(data.reduce((sum, item) => sum + item.abn.length, 0) / data.length)
      : 0
  };

  const getStatusPercentage = (status: string) => {
    if (data.length === 0) return 0;
    return Math.round((data.filter(item => item.status === status).length / data.length) * 100);
  };

  const getMostCommonEntityType = () => {
    if (data.length === 0) return 'N/A';
    const typeCounts = data.reduce((acc, item) => {
      acc[item.entity_type] = (acc[item.entity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommon = Object.entries(typeCounts).reduce((a, b) => 
      typeCounts[a[0]] > typeCounts[b[0]] ? a : b
    );
    
    return mostCommon[0];
  };

  const getMostCommonState = () => {
    if (data.length === 0) return 'N/A';
    const stateCounts = data.reduce((acc, item) => {
      acc[item.state] = (acc[item.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommon = Object.entries(stateCounts).reduce((a, b) => 
      stateCounts[a[0]] > stateCounts[b[0]] ? a : b
    );
    
    return mostCommon[0];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Entities */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Entities</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalEntities.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            Current Page: {data.length}
          </Badge>
        </div>
      </Card>

      {/* Active vs Inactive */}
      <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Entities</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.activeEntities.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            {getStatusPercentage('ACT')}% of total
          </Badge>
        </div>
      </Card>

      {/* Geographic Distribution */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">States Covered</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.uniqueStates}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            Top: {getMostCommonState()}
          </Badge>
        </div>
      </Card>

      {/* Entity Types */}
      <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Entity Types</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {stats.uniqueEntityTypes}
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
            Top: {getMostCommonEntityType().split(' ')[0]}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
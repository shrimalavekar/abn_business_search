import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X, MapPin, Building2, Calendar, Clock, Hash } from 'lucide-react';
import { FilterState } from '@/types/business';

interface FilterChipsProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

export function FilterChips({ filters, onFilterChange }: FilterChipsProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // Convert YYYYMMDD to DD/MM/YYYY
    if (dateString.length === 8) {
      return `${dateString.slice(6, 8)}/${dateString.slice(4, 6)}/${dateString.slice(0, 4)}`;
    }
    return dateString;
  };

  const removeState = (state: string) => {
    const currentStates = filters.states || [];
    onFilterChange({ states: currentStates.filter(s => s !== state) });
  };

  const removeEntityType = (type: string) => {
    const currentTypes = filters.entityTypes || [];
    onFilterChange({ entityTypes: currentTypes.filter(t => t !== type) });
  };

  const removePostcode = () => {
    onFilterChange({ postcode: '' });
  };

  const removeStatus = () => {
    onFilterChange({ status: '' });
  };

  const removeEffectiveFromStart = () => {
    onFilterChange({ effectiveFromStart: '' });
  };

  const removeEffectiveFromEnd = () => {
    onFilterChange({ effectiveFromEnd: '' });
  };

  const removeRecordUpdatedStart = () => {
    onFilterChange({ recordUpdatedStart: '' });
  };

  const removeRecordUpdatedEnd = () => {
    onFilterChange({ recordUpdatedEnd: '' });
  };

  const hasActiveFilters = 
    (filters.states?.length || 0) > 0 ||
    filters.postcode ||
    filters.status ||
    (filters.entityTypes?.length || 0) > 0 ||
    filters.effectiveFromStart ||
    filters.effectiveFromEnd ||
    filters.recordUpdatedStart ||
    filters.recordUpdatedEnd;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto mb4">
      <div className="flex items-center gap-2 py-2 min-w-max">
        {/* State Filters */}
        {filters.states?.map(state => (
          <Badge
            key={`state-${state}`}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <MapPin className="h-3 w-3" />
            <span className="text-sm font-medium">{state}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-blue-200 rounded-full"
              onClick={() => removeState(state)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {/* Postcode Filter */}
        {filters.postcode && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors"
          >
            <Hash className="h-3 w-3" />
            <span className="text-sm font-medium">Postcode: {filters.postcode}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-purple-200 rounded-full"
              onClick={removePostcode}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {/* Status Filter */}
        {filters.status && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
          >
            <span className="text-sm font-medium">Status: {filters.status}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-green-200 rounded-full"
              onClick={removeStatus}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {/* Entity Type Filters */}
        {filters.entityTypes?.map(type => (
          <Badge
            key={`type-${type}`}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors"
          >
            <Building2 className="h-3 w-3" />
            <span className="text-sm font-medium">{type}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-orange-200 rounded-full"
              onClick={() => removeEntityType(type)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {/* Effective From Date Range */}
        {filters.effectiveFromStart && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            <Calendar className="h-3 w-3" />
            <span className="text-sm font-medium">From: {formatDate(filters.effectiveFromStart)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-indigo-200 rounded-full"
              onClick={removeEffectiveFromStart}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {filters.effectiveFromEnd && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            <Calendar className="h-3 w-3" />
            <span className="text-sm font-medium">To: {formatDate(filters.effectiveFromEnd)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-indigo-200 rounded-full"
              onClick={removeEffectiveFromEnd}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {/* Record Updated Date Range */}
        {filters.recordUpdatedStart && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 transition-colors"
          >
            <Clock className="h-3 w-3" />
            <span className="text-sm font-medium">Updated From: {formatDate(filters.recordUpdatedStart)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-cyan-200 rounded-full"
              onClick={removeRecordUpdatedStart}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {filters.recordUpdatedEnd && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 transition-colors"
          >
            <Clock className="h-3 w-3" />
            <span className="text-sm font-medium">Updated To: {formatDate(filters.recordUpdatedEnd)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-cyan-200 rounded-full"
              onClick={removeRecordUpdatedEnd}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  );
}

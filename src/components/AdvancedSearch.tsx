import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FilterState } from '@/types/business';
import { X, Plus } from 'lucide-react';

interface AdvancedSearchProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  filterOptions: {
    states: string[];
    statuses: string[];
    entityTypes: string[];
  };
}

export function AdvancedSearch({ filters, onFilterChange, filterOptions }: AdvancedSearchProps) {
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    if (dateString.length === 8) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }
    return dateString;
  };

  const formatDateForStorage = (inputDate: string) => {
    if (!inputDate) return '';
    return inputDate.replace(/-/g, '');
  };

  const removeStateFilter = (state: string) => {
    const currentStates = filters.states || [];
    const newStates = currentStates.filter(s => s !== state);
    onFilterChange({ states: newStates });
  };

  const removeEntityTypeFilter = (type: string) => {
    const currentTypes = filters.entityTypes || [];
    const newTypes = currentTypes.filter(t => t !== type);
    onFilterChange({ entityTypes: newTypes });
  };

  const addStateFilter = (state: string) => {
    const currentStates = filters.states || [];
    if (!currentStates.includes(state)) {
      onFilterChange({ states: [...currentStates, state] });
    }
  };

  const addEntityTypeFilter = (type: string) => {
    const currentTypes = filters.entityTypes || [];
    if (!currentTypes.includes(type)) {
      onFilterChange({ entityTypes: [...currentTypes, type] });
    }
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Entity Name Search */}
        <div className="space-y-2">
          <Label className="text-sm">Entity Name Contains</Label>
          <Input
            placeholder="Partial entity name..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Supports partial matching
          </p>
        </div>

        {/* ABN Search */}
        <div className="space-y-2">
          <Label className="text-sm">ABN Search</Label>
          <Input
            placeholder="Enter ABN..."
            value={filters.search?.match(/^\d+$/) ? filters.search : ''}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                onFilterChange({ search: e.target.value });
              }
            }}
            maxLength={11}
          />
          <p className="text-xs text-muted-foreground">
            Exact or partial ABN match
          </p>
        </div>

        {/* Postcode Advanced */}
        <div className="space-y-2">
          <Label className="text-sm">Postcode Contains</Label>
          <Input
            placeholder="Postcode pattern..."
            value={filters.postcode || ''}
            onChange={(e) => onFilterChange({ postcode: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Supports partial matching
          </p>
        </div>

        {/* Multiple States */}
        <div className="space-y-2">
          <Label className="text-sm">States</Label>
          <Select
            onValueChange={(value) => addStateFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add state..." />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.states
                .filter(state => !(filters.states || []).includes(state))
                .map(state => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1">
            {filters.states?.map(state => (
              <Badge key={state} variant="secondary" className="text-xs">
                {state}
                <button
                  onClick={() => removeStateFilter(state)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Status with Logic */}
        <div className="space-y-2">
          <Label className="text-sm">Status</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) => onFilterChange({ status: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              {filterOptions.statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Multiple Entity Types */}
        <div className="space-y-2">
          <Label className="text-sm">Entity Types</Label>
          <Select
            onValueChange={(value) => addEntityTypeFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add entity type..." />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.entityTypes
                .filter(type => !(filters.entityTypes || []).includes(type))
                .map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1">
            {filters.entityTypes?.map(type => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type}
                <button
                  onClick={() => removeEntityTypeFilter(type)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Range - Effective From */}
        <div className="space-y-2">
          <Label className="text-sm">Effective Date Range</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={formatDateForInput(filters.effectiveFromStart || '')}
              onChange={(e) => onFilterChange({ effectiveFromStart: formatDateForStorage(e.target.value) })}
            />
            <Input
              type="date"
              value={formatDateForInput(filters.effectiveFromEnd || '')}
              onChange={(e) => onFilterChange({ effectiveFromEnd: formatDateForStorage(e.target.value) })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            From - To date range
          </p>
        </div>

        {/* Date Range - Record Updated */}
        <div className="space-y-2">
          <Label className="text-sm">Updated Date Range</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={formatDateForInput(filters.recordUpdatedStart || '')}
              onChange={(e) => onFilterChange({ recordUpdatedStart: formatDateForStorage(e.target.value) })}
            />
            <Input
              type="date"
              value={formatDateForInput(filters.recordUpdatedEnd || '')}
              onChange={(e) => onFilterChange({ recordUpdatedEnd: formatDateForStorage(e.target.value) })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            From - To date range
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filter Logic:</span>
            <Badge variant="outline">AND</Badge>
            <span>All conditions must match</span>
          </div>
          <Button
            variant="outline"
            onClick={() => onFilterChange({
              search: '',
              states: [],
              postcode: '',
              status: '',
              entityTypes: [],
              effectiveFromStart: '',
              effectiveFromEnd: '',
              recordUpdatedStart: '',
              recordUpdatedEnd: ''
            })}
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}
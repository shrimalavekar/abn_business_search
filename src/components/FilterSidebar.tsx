import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { FilterState } from '@/types/business';
import { Separator } from './ui/separator';
import { X } from 'lucide-react';
import { useDebounce } from '@/utils/debouns';
import { useState } from 'react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  filterOptions: {
    states: string[];
    statuses: string[];
    entityTypes: string[];
  };
}

export function FilterSidebar({ filters, onFilterChange, filterOptions }: FilterSidebarProps) {

  const [postcode, setPostcode] = useState('');


  const debouncedPostcode = useDebounce( (postcode: string) => {
    onFilterChange({ postcode: postcode });
  }, 500);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    // Convert YYYYMMDD to YYYY-MM-DD
    if (dateString.length === 8) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }
    return dateString;
  };

  const formatDateForStorage = (inputDate: string) => {
    if (!inputDate) return '';
    // Convert YYYY-MM-DD to YYYYMMDD
    return inputDate.replace(/-/g, '');
  };

  const handleStateToggle = (state: string) => {
    const currentStates = filters.states || [];
    const newStates = currentStates.includes(state)
      ? currentStates.filter(s => s !== state)
      : [...currentStates, state];
    onFilterChange({ states: newStates });
  };

  const handleEntityTypeToggle = (type: string) => {
    const currentTypes = filters.entityTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange({ entityTypes: newTypes });
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: '',
      states: [],
      postcode: '',
      status: '',
      entityTypes: [],
      effectiveFromStart: '',
      effectiveFromEnd: '',
      recordUpdatedStart: '',
      recordUpdatedEnd: ''
    });
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

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {/* State Filter */}
        <>
          <Label className="text-sm mb-2 block">State</Label>
          <div className=" max-h-24 overflow-y-auto">
            {filterOptions.states.map(state => (
              <div key={state} className="flex items-center space-x-2">
                <Checkbox
                  id={`state-${state}`}
                  checked={filters.states?.includes(state) || false}
                  onCheckedChange={() => handleStateToggle(state)}
                />
                <Label htmlFor={`state-${state}`} className="text-sm cursor-pointer">
                  {state}
                </Label>
              </div>
            ))}
          </div>
        </>

        <Separator />

        {/* Postcode Filter */}
        <div>
          <Label htmlFor="postcode" className="text-sm mb-2 block">Postcode</Label>
          <Input
            id="postcode"
            placeholder="Enter postcode..."
            value={filters.postcode || '' || postcode}
            onChange={(e) => {
              setPostcode(e.target.value);
              debouncedPostcode(e.target.value);
            }}
          />
        </div>

        <Separator />

        {/* Status Filter */}
        <div>
          <Label className="text-sm mb-2 block">Status</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) => onFilterChange({ status: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {filterOptions.statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Entity Type Filter */}
        <div>
          <Label className="text-sm mb-2 block">Entity Type</Label>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {filterOptions.entityTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.entityTypes?.includes(type) || false}
                  onCheckedChange={() => handleEntityTypeToggle(type)}
                />
                <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Effective From Date Range */}
        <div>
          <Label className="text-sm mb-2 block">Effective From Date</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="effective-start" className="text-xs text-muted-foreground">From</Label>
              <Input
                id="effective-start"
                type="date"
                value={formatDateForInput(filters.effectiveFromStart || '')}
                onChange={(e) => onFilterChange({ effectiveFromStart: formatDateForStorage(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="effective-end" className="text-xs text-muted-foreground">To</Label>
              <Input
                id="effective-end"
                type="date"
                value={formatDateForInput(filters.effectiveFromEnd || '')}
                onChange={(e) => onFilterChange({ effectiveFromEnd: formatDateForStorage(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Record Updated Date Range */}
        <div>
          <Label className="text-sm mb-2 block">Record Updated Date</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="updated-start" className="text-xs text-muted-foreground">From</Label>
              <Input
                id="updated-start"
                type="date"
                value={formatDateForInput(filters.recordUpdatedStart || '')}
                onChange={(e) => onFilterChange({ recordUpdatedStart: formatDateForStorage(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="updated-end" className="text-xs text-muted-foreground">To</Label>
              <Input
                id="updated-end"
                type="date"
                value={formatDateForInput(filters.recordUpdatedEnd || '')}
                onChange={(e) => onFilterChange({ recordUpdatedEnd: formatDateForStorage(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
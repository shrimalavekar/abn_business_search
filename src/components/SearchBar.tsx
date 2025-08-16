import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [localValue, onChange]);

  // Sync with external value changes
  // useEffect(() => {
  
  //   setLocalValue(value);
  // }, [value]);

  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by company name or ABN..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-10 h-12"
      />
    </div>
  );
}
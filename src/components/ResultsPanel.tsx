import { BusinessData } from '@/types/business';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowUpDown, ArrowUp, ArrowDown, Building2, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';

interface ResultsPanelProps {
  data: BusinessData[];
  onSort: (field: keyof BusinessData) => void;
  sortField: keyof BusinessData;
  sortDirection: 'asc' | 'desc';
  loading?: boolean;
}

export function ResultsPanel({ data, onSort, sortField, sortDirection, loading = false }: ResultsPanelProps) {
  const formatDate = (dateString: string) => {
    if (!dateString || dateString.length !== 8) return dateString;
    // Convert YYYYMMDD to DD/MM/YYYY
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${day}/${month}/${year}`;
  };

  const getSortIcon = (field: keyof BusinessData) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-40 group-hover:opacity-70 transition-opacity" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4 text-primary" /> : 
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === 'ACT';
    return (
      <Badge 
        variant={isActive ? 'default' : 'secondary'} 
        className={`
          relative overflow-hidden transition-all duration-300 hover:scale-105
          ${isActive 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' 
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300'
          }
        `}
      >
        <div className={`absolute inset-0 ${isActive ? 'bg-gradient-to-r from-green-400/20 to-emerald-400/20' : ''}`} />
        <span className="relative flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-500'} animate-pulse`} />
          {status}
        </span>
      </Badge>
    );
  };

  const getEntityTypeIcon = (type: string) => {
    return <Building2 className="h-4 w-4 text-muted-foreground mr-2" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
        <h3 className="text-lg mb-2">Loading data...</h3>
        <p className="text-sm text-muted-foreground">Please wait while we fetch the latest business information</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg mb-2">No results found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/50 hover:from-muted/50 hover:to-muted/70 transition-all duration-300">
              <TableHead className="w-40 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => onSort('abn')}
                  className="group h-auto p-2 hover:bg-background/50 rounded-md transition-all duration-200 hover:shadow-sm"
                >
                  <span className="flex items-center">
                    ABN
                    {getSortIcon('abn')}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="max-w-[400px] font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => onSort('entity_name')}
                  className="group h-auto p-2 hover:bg-background/50 rounded-md transition-all duration-200 hover:shadow-sm"
                >
                  <span className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    Company Name
                    {getSortIcon('entity_name')}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="w-24 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => onSort('state')}
                  className="group h-auto p-2 hover:bg-background/50 rounded-md transition-all duration-200 hover:shadow-sm"
                >
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    State
                    {getSortIcon('state')}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="w-28 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => onSort('postcode')}
                  className="group h-auto p-2 hover:bg-background/50 rounded-md transition-all duration-200 hover:shadow-sm"
                >
                  <span className="flex items-center">
                    Postcode
                    {getSortIcon('postcode')}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="w-32 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => onSort('status')}
                  className="group h-auto p-2 hover:bg-background/50 rounded-md transition-all duration-200 hover:shadow-sm"
                >
                  <span className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="w-40 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => onSort('effective_from')}
                  className="group h-auto p-2 hover:bg-background/50 rounded-md transition-all duration-200 hover:shadow-sm"
                >
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Effective From
                    {getSortIcon('effective_from')}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="w-48 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => onSort('entity_type')}
                  className="group h-auto p-2 hover:bg-background/50 rounded-md transition-all duration-200 hover:shadow-sm"
                >
                  <span className="flex items-center">
                    Company Type
                    {getSortIcon('entity_type')}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="w-40 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => onSort('record_updated')}
                  className="group h-auto p-2 hover:bg-background/50 rounded-md transition-all duration-200 hover:shadow-sm"
                >
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Last Updated
                    {getSortIcon('record_updated')}
                  </span>
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow 
                key={item.id} 
                className="table-row-animated group border-b border-border/30 hover:bg-gradient-to-r hover:from-muted/20 hover:to-accent/10 transition-all duration-300 hover:shadow-sm"
                style={{ 
                  '--animation-delay': `${index * 50}ms`
                } as React.CSSProperties}
              >
                <TableCell className="py-4">
                  <div className="font-mono text-sm bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-3 py-2 rounded-md border border-border/30 shadow-sm group-hover:shadow-md transition-all duration-300">
                    {item.abn}
                  </div>
                </TableCell>
                <TableCell className="py-4 max-w-[400px]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="group-hover:text-primary transition-colors duration-300 truncate">
                      {item.entity_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant="outline" 
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105 shadow-sm"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.state}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:scale-105 shadow-sm">
                    {item.postcode}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                    <span className="group-hover:text-foreground transition-colors duration-300">
                      {formatDate(item.effective_from)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center space-x-2">
                    {getEntityTypeIcon(item.entity_type)}
                    <span className="text-sm bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 px-3 py-1 rounded-full border border-orange-200 hover:from-orange-100 hover:to-yellow-100 transition-all duration-300 hover:scale-105 shadow-sm">
                      {item.entity_type}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                    <span className="group-hover:text-foreground transition-colors duration-300">
                      {formatDate(item.record_updated)}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
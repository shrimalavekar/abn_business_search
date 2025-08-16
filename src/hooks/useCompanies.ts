import { useState, useEffect, useCallback } from 'react';
import { BusinessData } from '@/types/business';

interface CompanyFilters {
  search?: string;
  states?: string[];
  postcode?: string;
  status?: string;
  entityTypes?: string[];
  effectiveFromStart?: string;
  effectiveFromEnd?: string;
  recordUpdatedStart?: string;
  recordUpdatedEnd?: string;
}

interface PaginationParams {
  page: number;
  limit: number;
  sortField: keyof BusinessData;
  sortDirection: 'asc' | 'desc';
}

interface CompanyResponse {
  data: BusinessData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useCompanies() {
  const [data, setData] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<CompanyFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortField: 'entity_name',
    sortDirection: 'asc',
  });

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Build query string from current state
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();

    params.set('page', String(pagination.page));
    params.set('limit', String(pagination.limit));
    params.set('sortField', String(pagination.sortField));
    params.set('sortDirection', pagination.sortDirection);

    if (filters.search) params.set('search', filters.search);
    if (filters.states?.length) filters.states.forEach(s => params.append('states', s));
    if (filters.postcode) params.set('postcode', filters.postcode);
    if (filters.status) params.set('status', filters.status);
    if (filters.entityTypes?.length) filters.entityTypes.forEach(t => params.append('entityTypes', t));
    if (filters.effectiveFromStart) params.set('effectiveFromStart', filters.effectiveFromStart);
    if (filters.effectiveFromEnd) params.set('effectiveFromEnd', filters.effectiveFromEnd);
    if (filters.recordUpdatedStart) params.set('recordUpdatedStart', filters.recordUpdatedStart);
    if (filters.recordUpdatedEnd) params.set('recordUpdatedEnd', filters.recordUpdatedEnd);

    return params.toString();
  }, [filters, pagination]);

  // Fetch whenever filters/pagination change (including initial mount)
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const qs = buildQuery();
        const res = await fetch(`/api/companies?${qs}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result: CompanyResponse = await res.json();
        setData(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (e) {
        if ((e as any).name === 'AbortError') return; // ignore aborted
        console.error('Error fetching companies:', e);
        setError(e instanceof Error ? e.message : 'Failed to fetch companies');
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort(); // cancel previous request on change/unmount
  }, [buildQuery]); // <-- NO `total` here

  // Public updaters
  const updateFilters = useCallback((newFilters: Partial<CompanyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // reset page when filters change
  }, []);

  const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const changePageSize = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const sortBy = useCallback((field: keyof BusinessData) => {
    setPagination(prev => {
      const nextDir: 'asc' | 'desc' =
        prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc';
      return { ...prev, sortField: field, sortDirection: nextDir, page: 1 };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    // Trigger a refetch by nudging pagination (or expose internal fetch if preferred)
    setPagination(prev => ({ ...prev }));
  }, []);

  return {
    data,
    loading,
    error,
    filters,
    pagination,
    total,
    totalPages,
    updateFilters,
    updatePagination,
    goToPage,
    changePageSize,
    sortBy,
    clearFilters,
    refetch,
  };
}

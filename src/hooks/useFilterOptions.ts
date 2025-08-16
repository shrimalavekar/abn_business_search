import { useState, useEffect } from 'react';

interface FilterOptions {
  states: string[];
  statuses: string[];
  entityTypes: string[];
}

export function useFilterOptions() {
  const [options, setOptions] = useState<FilterOptions>({
    states: [],
    statuses: [],
    entityTypes: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/companies/filter-options');
        
        if (!response.ok) {
          throw new Error('Failed to fetch filter options');
        }

        const data = await response.json();
        setOptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return {
    options,
    loading,
    error,
  };
}

import { useState, useEffect } from 'react';

interface CompanyStats {
  total: number;
  active: number;
  inactive: number;
  uniqueStates: number;
  uniqueEntityTypes: number;
}

export function useCompanyStats() {
  const [stats, setStats] = useState<CompanyStats>({
    total: 0,
    active: 0,
    inactive: 0,
    uniqueStates: 0,
    uniqueEntityTypes: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/companies/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch company statistics');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
  };
}

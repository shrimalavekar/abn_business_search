"use client";

import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { StatsDashboard } from "@/components/StatsDashboard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { FilterChips } from "@/components/FilterChips";
import { ResultsPanel } from "@/components/ResultsPanel";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { EnhancedPagination } from "@/components/EnhancedPagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessData, FilterState } from "@/types/business";
import { useCompanies } from "@/hooks/useCompanies";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { useCompanyStats } from "@/hooks/useCompanyStats";
import { CompanyResponse } from "@/app/api/companies/getCompany";

interface PaginationParams {
  page: number;
  limit: number;
  sortField: keyof BusinessData;
  sortDirection: "asc" | "desc";
}

export default function HomePage() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BusinessData[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterState>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortField: "entity_name",
    sortDirection: "asc",
  });

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();

    params.set("page", String(pagination.page));
    params.set("limit", String(pagination.limit));
    params.set("sortField", String(pagination.sortField));
    params.set("sortDirection", pagination.sortDirection);

    if (filters.search) params.set("search", filters.search);
    if (filters.states?.length)
      filters.states.forEach((s) => params.append("states", s));
    if (filters.postcode) params.set("postcode", filters.postcode);
    if (filters.status) params.set("status", filters.status);
    if (filters.entityTypes?.length)
      filters.entityTypes.forEach((t) => params.append("entityTypes", t));
    if (filters.effectiveFromStart)
      params.set("effectiveFromStart", filters.effectiveFromStart);
    if (filters.effectiveFromEnd)
      params.set("effectiveFromEnd", filters.effectiveFromEnd);
    if (filters.recordUpdatedStart)
      params.set("recordUpdatedStart", filters.recordUpdatedStart);
    if (filters.recordUpdatedEnd)
      params.set("recordUpdatedEnd", filters.recordUpdatedEnd);

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
        const res = await fetch(`/api/companies?${qs}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result: CompanyResponse = await res.json();
        setData(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (e) {
        if ((e as any).name === "AbortError") return; // ignore aborted
        console.error("Error fetching companies:", e);
        setError(e instanceof Error ? e.message : "Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort(); // cancel previous request on change/unmount
  }, [buildQuery]);

  // Get filter options from API
  const { options: filterOptions } = useFilterOptions();

  // Get company statistics
  const { stats } = useCompanyStats();

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // reset page when filters change
  };

  // Handle sorting
  const handleSort = useCallback((field: keyof BusinessData) => {
    setPagination((prev) => {
      const nextDir: "asc" | "desc" =
        prev.sortField === field && prev.sortDirection === "asc"
          ? "desc"
          : "asc";
      return { ...prev, sortField: field, sortDirection: nextDir, page: 1 };
    });
  }, []);

  // Check if there are active filters
  const hasActiveFilters =
    (filters.states?.length || 0) > 0 ||
    filters.postcode ||
    filters.status ||
    (filters.entityTypes?.length || 0) > 0 ||
    filters.effectiveFromStart ||
    filters.effectiveFromEnd ||
    filters.recordUpdatedStart ||
    filters.recordUpdatedEnd;

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error loading data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  function changePageSize(items: number): void {
    setPagination((prev) => ({ ...prev, limit: items, page: 1 }));
  }

  function goToPage(page: number): void {
    setPagination((prev) => ({ ...prev, page }));
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Header */}
      <Header
        searchValue={filters.search || ""}
        onSearchChange={(search) => {
          console.log("onSearchChange", search);
          // setFilters(prev => ({ ...prev, search }));
          // setPagination(prev => ({ ...prev, page: 1 })); // reset page when filters change
        }}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Advanced Search Section */}
      {showAdvanced && (
        <div className="border-b bg-muted/30 flex-shrink-0">
          <div className="container mx-auto px-4 py-6">
            <AdvancedSearch
              filters={filters}
              onFilterChange={handleFilterChange}
              filterOptions={filterOptions}
            />
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      {/* {stats && (
        <div className="flex-shrink-0 border-b bg-muted/20">
          <div className="container mx-auto px-4 py-4">
            <StatsDashboard data={data} filteredCount={total} />
          </div>
        </div>
      )} */}

      {/* Main Content Area - Takes remaining height */}
      <div className="flex-1 flex overflow-hidden w-full">
        <div className="w-full flex gap-6 h-full px-4 py-4">
          {/* Sidebar */}
          <aside
            className={`transition-all duration-300 flex-shrink-0 ${
              sidebarCollapsed ? "hidden lg:block w-64" : "w-80"
            }`}
          >
            <div className="h-full overflow-y-auto">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                filterOptions={filterOptions}
              />
            </div>
          </aside>

          {/* Main Results Area */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
              sidebarCollapsed ? "lg:ml-0" : ""
            }`}
          >
            {/* Active Filter Chips */}
            <div className="flex-shrink-0">
              <FilterChips
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {loading ? (
              <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-lg text-muted-foreground">
                    Loading business data...
                  </p>
                </div>
              </div>
            ) : (
              <Card className="flex-1 flex flex-col bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-2 min-h-0">
                <div className="flex-1 overflow-hidden min-h-0">
                  <ResultsPanel
                    data={data}
                    onSort={handleSort}
                    sortField={pagination.sortField as keyof BusinessData}
                    sortDirection={pagination.sortDirection}
                    loading={loading}
                  />
                </div>

                {/* Enhanced Pagination - Fixed at bottom */}
                <div className="border-t bg-muted/30 px-6 py-4 flex-shrink-0">
                  <EnhancedPagination
                    currentPage={pagination.page}
                    totalPages={totalPages}
                    itemsPerPage={pagination.limit}
                    totalItems={total}
                    onPageChange={goToPage}
                    onItemsPerPageChange={changePageSize}
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

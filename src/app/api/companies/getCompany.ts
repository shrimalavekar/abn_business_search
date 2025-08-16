import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface CompanyFilters {
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

export interface PaginationParams {
  page: number;
  limit: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CompanyData {
  id: number;
  abn: string;
  entity_name: string;
  state: string;
  postcode: string;
  status: string;
  effective_from: string;
  entity_type: string;
  record_updated: string;
  created_at: string;
}

export interface CompanyResponse {
  data: CompanyData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getCompanies(
  filters: CompanyFilters = {},
  pagination: PaginationParams
): Promise<CompanyResponse> {
  try {
    let query = supabase
      .from('abn_data')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      query = query.or(`entity_name.ilike.%${searchTerm}%,entity_type.ilike.%${searchTerm}%`);
    }

    // Apply state filter
    if (filters.states && filters.states.length > 0) {
      query = query.in('state', filters.states);
    }

    // Apply postcode filter
    if (filters.postcode) {
      query = query.ilike('postcode', `%${filters.postcode}%`);
    }

    // Apply status filter
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Apply entity type filter
    if (filters.entityTypes && filters.entityTypes.length > 0) {
      query = query.in('entity_type', filters.entityTypes);
    }

    // Apply effective from date range
    if (filters.effectiveFromStart || filters.effectiveFromEnd) {
      if (filters.effectiveFromStart) {
        query = query.gte('effective_from', filters.effectiveFromStart);
      }
      if (filters.effectiveFromEnd) {
        query = query.lte('effective_from', filters.effectiveFromEnd);
      }
    }

    // Apply record updated date range
    if (filters.recordUpdatedStart || filters.recordUpdatedEnd) {
      if (filters.recordUpdatedStart) {
        query = query.gte('record_updated', filters.recordUpdatedStart);
      }
      if (filters.recordUpdatedEnd) {
        query = query.lte('record_updated', filters.recordUpdatedEnd);
      }
    }

    // Apply sorting
    if (pagination.sortField) {
      const sortDirection = pagination.sortDirection || 'asc';
      query = query.order(pagination.sortField, { ascending: sortDirection === 'asc' });
    } else {
      // Default sorting by created_at
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const offset = (pagination.page - 1) * pagination.limit;
    query = query.range(offset, offset + pagination.limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pagination.limit);

    return {
      data: data || [],
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages
    };

  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
}

// Helper function to get filter options for dropdowns
export async function getFilterOptions() {
  try {
    // Get all data and filter in JavaScript to ensure we don't miss anything
    const { data: allData } = await supabase
      .from('abn_data')
      .select('state, status, entity_type');

    if (!allData || allData.length === 0) {
      return {
        states: [],
        statuses: [],
        entityTypes: []
      };
    }

    // Extract unique values and filter out empty/null values
    const states = [...new Set(allData.map(item => item.state).filter(state => state && state.trim() !== ''))].sort();
    const statuses = [...new Set(allData.map(item => item.status).filter(status => status && status.trim() !== ''))].sort();
    const entityTypes = [...new Set(allData.map(item => item.entity_type).filter(type => type && type.trim() !== ''))].sort();

    return {
      states,
      statuses,
      entityTypes
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
}

// Helper function to get company statistics
export async function getCompanyStats() {
  try {
    const { count: total } = await supabase
      .from('abn_data')
      .select('*', { count: 'exact', head: true });

    const { count: active } = await supabase
      .from('abn_data')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ACT');

    const { count: inactive } = await supabase
      .from('abn_data')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'CAN');

    // Get all data for stats calculation
    const { data: allData } = await supabase
      .from('abn_data')
      .select('state, entity_type');

    return {
      total: total || 0,
      active: active || 0,
      inactive: inactive || 0,
      uniqueStates: new Set(allData?.map((item: any) => item.state).filter((state: any) => state && state.trim() !== '')).size,
      uniqueEntityTypes: new Set(allData?.map((item: any) => item.entity_type).filter((type: any) => type && type.trim() !== '')).size
    };
  } catch (error) {
    console.error('Error fetching company stats:', error);
    throw error;
  }
}
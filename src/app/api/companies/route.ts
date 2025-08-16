import { NextRequest, NextResponse } from 'next/server';
import { getCompanies, getFilterOptions, getCompanyStats, CompanyFilters, PaginationParams } from './getCompany';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortField = searchParams.get('sortField') || undefined;
    const sortDirection = (searchParams.get('sortDirection') as 'asc' | 'desc') || 'desc';

    // Parse filter parameters
    const filters: CompanyFilters = {
      search: searchParams.get('search') || undefined,
      states: searchParams.get('states')?.split(',').filter(Boolean) || undefined,
      postcode: searchParams.get('postcode') || undefined,
      status: searchParams.get('status') || undefined,
      entityTypes: searchParams.get('entityTypes')?.split(',').filter(Boolean) || undefined,
      effectiveFromStart: searchParams.get('effectiveFromStart') || undefined,
      effectiveFromEnd: searchParams.get('effectiveFromEnd') || undefined,
      recordUpdatedStart: searchParams.get('recordUpdatedStart') || undefined,
      recordUpdatedEnd: searchParams.get('recordUpdatedEnd') || undefined,
    };

    const pagination: PaginationParams = {
      page,
      limit,
      sortField,
      sortDirection,
    };

    // Get companies data
    const result = await getCompanies(filters, pagination);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

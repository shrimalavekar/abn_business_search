import { NextResponse } from 'next/server';
import { getFilterOptions } from '../getCompany';

export async function GET() {
  try {
    const filterOptions = await getFilterOptions();
    return NextResponse.json(filterOptions);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}

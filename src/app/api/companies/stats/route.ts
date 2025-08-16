import { NextResponse } from 'next/server';
import { getCompanyStats } from '../getCompany';

export async function GET() {
  try {
    const stats = await getCompanyStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company statistics' },
      { status: 500 }
    );
  }
}

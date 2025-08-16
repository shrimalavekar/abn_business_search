# Business Search Application

A comprehensive Australian business directory application with advanced search and filtering capabilities, built with Next.js, TypeScript, and Supabase.

## Features

- 🔍 **Advanced Search**: Search by company name or entity type
- 🎯 **Smart Filtering**: Filter by state, postcode, status, entity type, and date ranges
- 📊 **Real-time Statistics**: View business data analytics and insights
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ⚡ **Fast Performance**: Optimized with Next.js and efficient database queries

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd business-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
Run the following SQL in your Supabase SQL editor:

```sql
create table public.abn_data (
    id bigserial not null,
    abn character varying(11) not null,
    entity_name text null,
    state character varying(3) null,
    postcode character varying(10) null,
    status character varying(10) null,
    effective_from character varying(8) null,
    entity_type text null,
    record_updated character varying(8) null,
    created_at timestamp with time zone null default now(),
    constraint abn_data_pkey primary key (id)
) TABLESPACE pg_default;
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Get Companies
```
GET /api/companies
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `sortField` (string): Field to sort by
- `sortDirection` (string): 'asc' or 'desc'
- `search` (string): Search term for entity_name or entity_type
- `states` (string): Comma-separated list of states
- `postcode` (string): Postcode filter
- `status` (string): Status filter
- `entityTypes` (string): Comma-separated list of entity types
- `effectiveFromStart` (string): Start date for effective_from (YYYYMMDD)
- `effectiveFromEnd` (string): End date for effective_from (YYYYMMDD)
- `recordUpdatedStart` (string): Start date for record_updated (YYYYMMDD)
- `recordUpdatedEnd` (string): End date for record_updated (YYYYMMDD)

**Example:**
```bash
GET /api/companies?page=1&limit=20&search=tech&states=NSW,VIC&status=active
```

### Get Filter Options
```
GET /api/companies/filter-options
```

Returns available options for dropdown filters:
```json
{
  "states": ["NSW", "VIC", "QLD", ...],
  "statuses": ["active", "inactive"],
  "entityTypes": ["Private Company", "Public Company", "Partnership", ...]
}
```

### Get Company Statistics
```
GET /api/companies/stats
```

Returns business statistics:
```json
{
  "total": 1000,
  "active": 850,
  "inactive": 150,
  "uniqueStates": 8,
  "uniqueEntityTypes": 5
}
```

## Frontend Hooks

### useCompanies
Custom hook for managing company data with filters and pagination:

```typescript
import { useCompanies } from '@/hooks/useCompanies';

function MyComponent() {
  const {
    data,
    loading,
    error,
    filters,
    pagination,
    total,
    totalPages,
    updateFilters,
    goToPage,
    sortBy,
    clearFilters
  } = useCompanies();

  // Update search filter
  const handleSearch = (searchTerm: string) => {
    updateFilters({ search: searchTerm });
  };

  // Sort by field
  const handleSort = (field: string) => {
    sortBy(field, 'asc');
  };

  return (
    // Your component JSX
  );
}
```

### useFilterOptions
Hook for fetching filter options:

```typescript
import { useFilterOptions } from '@/hooks/useFilterOptions';

function FilterComponent() {
  const { options, loading, error } = useFilterOptions();

  return (
    <select>
      {options.states.map(state => (
        <option key={state} value={state}>{state}</option>
      ))}
    </select>
  );
}
```

### useCompanyStats
Hook for fetching company statistics:

```typescript
import { useCompanyStats } from '@/hooks/useCompanyStats';

function StatsComponent() {
  const { stats, loading, error } = useCompanyStats();

  return (
    <div>
      <p>Total Companies: {stats.total}</p>
      <p>Active: {stats.active}</p>
      <p>Inactive: {stats.inactive}</p>
    </div>
  );
}
```

## Database Schema

The application uses a single table `abn_data` with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| abn | varchar(11) | Australian Business Number |
| entity_name | text | Company/Entity name |
| state | varchar(3) | Australian state/territory |
| postcode | varchar(10) | Postal code |
| status | varchar(10) | Entity status (active/inactive) |
| effective_from | varchar(8) | Effective date (YYYYMMDD) |
| entity_type | text | Type of entity |
| record_updated | varchar(8) | Last update date (YYYYMMDD) |
| created_at | timestamp | Record creation timestamp |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build cache

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── companies/     # Company API endpoints
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── ui/                # Reusable UI components
│   └── ...                # Feature components
├── hooks/                 # Custom React hooks
├── api/                   # API utilities
│   └── company/           # Company data functions
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

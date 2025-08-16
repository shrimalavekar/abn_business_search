export interface BusinessData {
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

export interface FilterState {
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

export interface FilterOptions {
  states: string[];
  statuses: string[];
  entityTypes: string[];
}

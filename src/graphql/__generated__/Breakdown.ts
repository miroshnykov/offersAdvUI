/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Breakdown
// ====================================================

export interface Breakdown_breakdown_data {
  __typename: "BreakdownItem";
  clicks: number;
  conversions: number;
  revenue: number;
  geo: string | null;
  offer: string | null;
  device: string | null;
  day: string | null;
}

export interface Breakdown_breakdown {
  __typename: "BreakdownResponse";
  count: number;
  data: Breakdown_breakdown_data[];
}

export interface Breakdown {
  breakdown: Breakdown_breakdown | null;
}

export interface BreakdownVariables {
  entity: string;
  customPeriod?: string[] | null;
  periodType: string;
  page: number;
  limit: number;
  orderBy: string;
  orderAsc: boolean;
}

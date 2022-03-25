/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Reports
// ====================================================

export interface Reports_reports {
  __typename: "ReportResponse";
  dates: string[];
  clicks: number[];
  conversions: number[];
}

export interface Reports {
  reports: Reports_reports | null;
}

export interface ReportsVariables {
  periodType: string;
  customPeriod?: string[] | null;
}

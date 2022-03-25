/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCurrencies
// ====================================================

export interface getCurrencies_getCurrencies {
  __typename: "Currency";
  id: number;
  symbol: string;
  abbr: string;
}

export interface getCurrencies {
  getCurrencies: getCurrencies_getCurrencies[] | null;
}

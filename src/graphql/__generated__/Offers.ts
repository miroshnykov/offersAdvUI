/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Offers
// ====================================================

export interface Offers_listOffer_currencies {
  __typename: "Currency";
  id: number;
  symbol: string;
}

export interface Offers_listOffer {
  __typename: "Offer";
  id: number;
  name: string;
  descriptions: string;
  payin: number;
  conversion_type: string;
  is_cpm_option_enabled: boolean;
  offer_id_redirect: number;
  currency_id: number;
  sfl_vertical_id: number;
  step: number;
  status: string;
  currencies: Offers_listOffer_currencies[];
}

export interface Offers {
  listOffer: Offers_listOffer[] | null;
}

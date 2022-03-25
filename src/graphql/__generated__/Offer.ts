/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Offer
// ====================================================

export interface Offer_getOffer_customPayin {
  __typename: "OfferCustomPayin";
  id: number;
  geo: string;
  payin: number;
}

export interface Offer_getOffer_currencies {
  __typename: "Currency";
  id: number;
  abbr: string;
}

export interface Offer_getOffer_verticals {
  __typename: "Vertical";
  id: number;
  name: string;
}

export interface Offer_getOffer_landings {
  __typename: "Landing";
  id: number;
  name: string;
  url: string;
  isDefault: boolean;
}

export interface Offer_getOffer_customLandings {
  __typename: "CustomLandingsOutput";
  id: number | null;
  country: string;
  name: string;
  pos: number;
  url: string;
}

export interface Offer_getOffer_caps {
  __typename: "OfferCap";
  enabled: number;
  clicks_day: number;
  clicks_week: number;
  clicks_month: number;
  clicks_redirect_offer_id: number;
  clicks_redirect_offer_use_default: boolean;
  sales_day: number;
  sales_week: number;
  sales_month: number;
  sales_redirect_offer_id: number;
  sales_redirect_offer_use_default: boolean;
  start_date: number | null;
  end_date: number | null;
  use_start_end_date: boolean;
}

export interface Offer_getOffer {
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
  status: string;
  token: string;
  geoRules: string | null;
  use_start_end_date: boolean;
  start_date: number | null;
  end_date: number | null;
  step: number;
  advertiser_manager: string;
  customPayin: Offer_getOffer_customPayin[];
  currencies: Offer_getOffer_currencies[];
  verticals: Offer_getOffer_verticals[];
  landings: Offer_getOffer_landings[] | null;
  customLandings: Offer_getOffer_customLandings[];
  caps: Offer_getOffer_caps;
}

export interface Offer {
  getOffer: Offer_getOffer | null;
}

export interface OfferVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateOfferInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateOffer
// ====================================================

export interface UpdateOffer_updateOffer_landings {
  __typename: "Landing";
  id: number;
  name: string;
  url: string;
  isDefault: boolean;
}

export interface UpdateOffer_updateOffer_customLandings {
  __typename: "CustomLandingsOutput";
  id: number | null;
  name: string;
  pos: number;
  url: string;
  country: string;
}

export interface UpdateOffer_updateOffer_caps {
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

export interface UpdateOffer_updateOffer_customPayin {
  __typename: "OfferCustomPayin";
  id: number;
  geo: string;
  payin: number;
}

export interface UpdateOffer_updateOffer {
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
  geoRules: string | null;
  start_date: number | null;
  end_date: number | null;
  use_start_end_date: boolean;
  step: number;
  landings: UpdateOffer_updateOffer_landings[] | null;
  customLandings: UpdateOffer_updateOffer_customLandings[];
  caps: UpdateOffer_updateOffer_caps;
  customPayin: UpdateOffer_updateOffer_customPayin[];
}

export interface UpdateOffer {
  updateOffer: UpdateOffer_updateOffer | null;
}

export interface UpdateOfferVariables {
  offer: UpdateOfferInput;
}

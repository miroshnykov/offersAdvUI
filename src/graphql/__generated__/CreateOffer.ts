/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateOffer
// ====================================================

export interface CreateOffer_createOffer {
  __typename: "Offer";
  id: number;
  name: string;
  step: number;
}

export interface CreateOffer {
  createOffer: CreateOffer_createOffer | null;
}

export interface CreateOfferVariables {
  name: string;
  step?: number | null;
}

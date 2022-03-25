/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProfileData, Agreements } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: SignUp
// ====================================================

export interface SignUp_register {
  __typename: "User";
  id: string;
  name: string;
}

export interface SignUp {
  register: SignUp_register;
}

export interface SignUpVariables {
  email: string;
  password: string;
  repeatPassword: string;
  profileData: ProfileData;
  agreements: Agreements;
}

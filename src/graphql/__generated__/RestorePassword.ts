/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RestorePassword
// ====================================================

export interface RestorePassword {
  restorePassword: boolean;
}

export interface RestorePasswordVariables {
  token: string;
  password: string;
  repeatPassword: string;
}

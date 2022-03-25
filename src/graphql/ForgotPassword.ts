import gql from 'graphql-tag';

export const ForgotPasswordMutation = gql`mutation ForgotPassword($email: String!) {
  forgotPassword (email: $email)
}`;

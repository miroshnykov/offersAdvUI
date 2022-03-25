import gql from 'graphql-tag';

export const RestorePasswordMutation = gql`mutation RestorePassword ($token: String!, $password: String!, $repeatPassword: String! ) {
  restorePassword (data: {token: $token, password: $password, repeatPassword: $repeatPassword})
}`;

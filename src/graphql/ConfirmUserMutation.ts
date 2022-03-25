import gql from 'graphql-tag';

export const ConfirmUserMutation = gql`mutation ConfirmUser($token: String!) {
    confirmUser(token: $token)
}`;

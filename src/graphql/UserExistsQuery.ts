import gql from 'graphql-tag';

export const UserExistsQuery = gql`query UserExists($email: String!){
  userExists(email: $email)
}`;

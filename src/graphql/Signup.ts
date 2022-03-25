import gql from 'graphql-tag';

export const SignUpMutation = gql`mutation SignUp(
  $email: String!,
  $password: String!,
  $repeatPassword: String!
  $profileData: ProfileData!
  $agreements: Agreements!
) {
    register (data: {
      email: $email
      password: $password
      repeatPassword: $repeatPassword
      profileData: $profileData
      agreements: $agreements
    }) {
        id
        name
    }
}`;

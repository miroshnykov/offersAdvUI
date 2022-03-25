import gql from 'graphql-tag';

export const CreateOfferMutation = gql`mutation CreateOffer($name: String!, $step: Float) {
  createOffer(name: $name, step: $step) {
    id
    name
    step
  }
}`;

import gql from 'graphql-tag';

export const RemoveOfferMutation = gql`mutation DeleteOffer($id: Float!) {
  deleteOffer(id: $id)
}`;

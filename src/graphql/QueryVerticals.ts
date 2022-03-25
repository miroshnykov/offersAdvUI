import gql from 'graphql-tag';

export const QueryVerticals = gql`query getVerticals{
  getVerticals {
    id
    name
  }
}`;

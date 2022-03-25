import gql from 'graphql-tag';

export const QueryCurrencies = gql`query getCurrencies{
  getCurrencies {
    id
    symbol
    abbr
  }
}`;

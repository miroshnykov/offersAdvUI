import gql from 'graphql-tag';

export const IdQuery = gql`query IdQuery($search: String, $filters: OfferFiltersInput, $pagination: OfferPaginationInput!, $column: String) {
    listOffer(search: $search, filters: $filters, pagination: $pagination, column: $column) {
        data {
          id
        }
    }
}`;

export const ConversionTypeQuery = gql`query ConversionTypeQuery($search: String, $filters: OfferFiltersInput, $pagination: OfferPaginationInput!, $column: String) {
    listOffer(search: $search, filters: $filters, pagination: $pagination, column: $column) {
        data {
          conversion_type
        }
    }
}`;

export const NameQuery = gql`query NameQuery($search: String, $filters: OfferFiltersInput, $pagination: OfferPaginationInput!, $column: String) {
    listOffer(search: $search, filters: $filters, pagination: $pagination, column: $column) {
        data {
          name
        }
    }
}`;

export const PayinQuery = gql`query PayinQuery($search: String, $filters: OfferFiltersInput, $pagination: OfferPaginationInput!, $column: String) {
    listOffer(search: $search, filters: $filters, pagination: $pagination, column: $column) {
        data {
          payin
        }
    }
}`;

export const StatusQuery = gql`query StatusQuery($search: String, $filters: OfferFiltersInput, $pagination: OfferPaginationInput!, $column: String) {
    listOffer(search: $search, filters: $filters, pagination: $pagination, column: $column) {
        data {
          status
        }
    }
}`;

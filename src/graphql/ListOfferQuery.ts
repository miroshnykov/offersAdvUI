import gql from 'graphql-tag';

export const ListOfferQuery = gql`query Offers($search: String, $filters: OfferFiltersInput, $pagination: OfferPaginationInput!) {
    listOffer(search: $search, filters: $filters, pagination: $pagination) {
        data {
          id
          name
          descriptions
          payin
          conversion_type
          is_cpm_option_enabled
          offer_id_redirect
          currency_id
          sfl_vertical_id
          step
          status
          currencies {
            id
            symbol
          }
          landing_page {
            url
          }
        }
        count
    }
}`;

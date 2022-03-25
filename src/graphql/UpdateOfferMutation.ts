import gql from 'graphql-tag';

export const UpdateOfferMutation = gql`mutation UpdateOffer($offer: UpdateOfferInput!) {
  updateOffer(data: $offer) {
    id
    name
    descriptions
    payin
    conversion_type
    is_cpm_option_enabled
    offer_id_redirect
    currency_id
    sfl_vertical_id
    status
    geoRules
    start_date
    end_date
    use_start_end_date
    step
    landings {
      id
      name
      url
      isDefault
    }
    customLandings {
      id
      name
      pos
      url
      country
    }
    caps {
      enabled
      clicks_day
      clicks_week
      clicks_month
      clicks_redirect_offer_id
      clicks_redirect_offer_use_default
      sales_day
      sales_week
      sales_month
      sales_redirect_offer_id
      sales_redirect_offer_use_default
      start_date
      end_date
      use_start_end_date
    }
    customPayin {
      id
      geo
      payin
    }
  }
}`;

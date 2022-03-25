import gql from 'graphql-tag';

export const BreakDownQuery = gql`query Breakdown(
                  $entity: String!
                  $customPeriod: [String!]
                  $periodType: String!
                  $page: Int!
                  $limit: Int!
                  $orderBy: String!
                  $orderAsc: Boolean!
              ) {
    breakdown(
      customPeriod: $customPeriod
        entity: $entity
        periodType: $periodType
        page: $page
        limit: $limit
        orderBy: $orderBy
        orderAsc: $orderAsc
    ) {
        count
        data {
            clicks,
            conversions,
            revenue
            geo,
            offer,
            device,
            day
        }
    }
}`;

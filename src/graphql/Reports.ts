import gql from 'graphql-tag';

export const ReportsQuery = gql`query Reports($periodType: String!, $customPeriod: [String!]) {
    reports(
        periodType: $periodType,
        customPeriod: $customPeriod
    ) {
        dates,
        clicks,
        conversions
    }
}`;

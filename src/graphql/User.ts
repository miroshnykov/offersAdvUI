import gql from 'graphql-tag';

export const UserQuery = gql`query User{
    user: currentUser {
        id,
        name,
        email,
    }
}`;

import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { ApolloClientClientConfig, createApolloClient } from 'vue-cli-plugin-apollo/graphql-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// eslint-disable-next-line import/no-duplicates
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { concat } from 'apollo-link';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { auth, logout, setTokens } from '@/utils/auth';

const fpPromise = FingerprintJS.load();

const apiUrl = `${process.env.VUE_APP_GRAPHQL_HTTP}` || 'http://localhost:4000';

type VueApolloClient = ApolloClient<InMemoryCache>

// Install the vue plugin
Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = 'accessToken';

// Http endpoint
const httpEndpoint = `${apiUrl}/graphql` || 'http://localhost:4000/graphql';
// Files URL root
export const filesRoot = process.env.VUE_APP_FILES_ROOT || httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'));

Vue.prototype.$filesRoot = filesRoot;

// const resolvers = {
//   Mutation: {
//     user(_: any, { user }: any, { cache }: any) {
//       cache.writeQuery({ query: LOCAL_USER, user });
//     },
//   },
// };

const cache = new InMemoryCache();

cache.writeData({ data: { user: {} } });

// Config
const defaultOptions: ApolloClientClientConfig<InMemoryCache> = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  // link: myLink

  // Override default cache
  cache,

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
};

// Call this in the Vue app file
export function createProvider(options = {}): VueApollo {
  const fpLink = setContext(async (operation, previousContext) => {
    const { headers } = previousContext;

    const fp = await fpPromise;
    const result = await fp.get();

    return {
      ...previousContext,
      headers: {
        ...headers,
        vid: result.visitorId,
      },
    };
  });

  const authLink = setContext(async (operation, previousContext) => {
    const { headers } = previousContext;

    return {
      ...previousContext,
      headers: {
        ...headers,
        Authorization: `Bearer ${await auth(`${apiUrl}/refresh_token`)()}`,
      },
    };
  });

  // Create apollo client
  const { apolloClient } = createApolloClient({
    ...defaultOptions,
    ...options,
    link: concat(fpLink, authLink) as any,
  });

  // Create vue apollo provider
  return new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message);
    },
  });
}

// Manually call this when user log in
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function onLogin(apolloClient: VueApolloClient, token: string) {
  setTokens({ accessToken: token });

  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message);
  }
}

// Manually call this when user log out
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function onLogout(apolloClient: VueApolloClient) {
  logout();
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message);
  }
}

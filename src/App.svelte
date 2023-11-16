<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { addMessages, init } from 'svelte-i18n';
  import Router from 'svelte-spa-router';

  import en from '../data/lang/en.json';

  import { PAGES, isPageAvailable } from 'src/routes';

  import Layout from './layouts/Layout.svelte';
  import NotFound from './pages/NotFound.svelte';
  import { initDayjsPlugins } from './services/datetime';

  const queryClient = new QueryClient();

  addMessages('en', en);

  init({
    initialLocale: 'en',
    fallbackLocale: 'en',
  });

  initDayjsPlugins();

<<<<<<< HEAD
  //get routes object from pages array
  const routes = PAGES.reduce((cur, page) => {
    if (isPageAvailable(page)) cur[page.path] = page.component;
    return cur;
  }, {});

  //for other routes
  routes['*'] = NotFound;
=======
  const routes = {
    [PATHS.root]: Dashboard,
    [PATHS.market]: wrap({
      asyncComponent: () => import('./pages/Market/Market.svelte'),
    }),
    [PATHS.wallet]: wrap({
      asyncComponent: () => import('./pages/Wallet/Wallet.svelte'),
    }),
    [PATHS.transactions]: wrap({
      asyncComponent: () => import('./pages/Transactions/Transactions.svelte'),
    }),
    [PATHS.swap]: wrap({
      asyncComponent: () => import('./pages/Swap.svelte'),
    }),
  };
  if (import.meta.env.DEV) {
    routes[PATHS.devAssets] = DevAssets;
  }
  // Catch-all route last. This path should be the last in the route path list.
  routes[PATHS.any] = NotFound;
>>>>>>> feature/access_wallet_balance-SITE-51-new
</script>

<QueryClientProvider client="{queryClient}">
  <Layout>
    <Router {routes} />
  </Layout>
</QueryClientProvider>

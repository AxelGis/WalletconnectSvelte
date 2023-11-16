<<<<<<< HEAD
import Subscriptions from 'src/pages/Subscriptions/Subscriptions.svelte';
import Dashboard from 'src/pages/Dashboard/index.svelte';
import Market from 'src/pages/Market/Market.svelte';
import Transactions from 'src/pages/Transactions/Transactions.svelte';
import Wallet from 'src/pages/Wallet/Wallet.svelte';
import DevAssets from 'src/pages/_DevAssets/DevAssets.svelte';
import Rules from 'src/pages/Rules/Rules.svelte';

export type Page = {
  name?: string;
  menuItem?: string;
  langKeySuffix?: string;
  group: string;
  path: string;
  menuPath?: string;
  icon: string;
  component: any;
  leftMenu: boolean;
  onlyDev?: boolean;
=======
const PATHS = {
  root: '/',
  wallet: '/wallet',
  market: '/market',
  devAssets: '/dev-assets',
  transactions: '/transactions',
  swap: '/swap',
  any: '*',
>>>>>>> feature/access_wallet_balance-SITE-51-new
};

export const PAGES: Page[] = [
  //--- dashboards
  {
    langKeySuffix: 'home',
    group: 'dashboards',
    path: '/',
    icon: 'bx bx-home-circle',
    component: Dashboard,
    leftMenu: true,
  },
  {
    langKeySuffix: 'market',
    group: 'dashboards',
    path: '/market',
    icon: 'bx bx-basket',
    component: Market,
    leftMenu: true,
  },
  {
    langKeySuffix: 'rules',
    group: 'dashboards',
    path: '/rules/:id?/:action?',
    menuPath: '/rules',
    icon: 'bx bx-code-block',
    component: Rules,
    leftMenu: true,
  },

  //--- assets
  {
    langKeySuffix: 'subscriptions',
    group: 'assets',
    path: '/subscriptions',
    icon: 'bx bx-pen',
    component: Subscriptions,
    leftMenu: true,
  },
  {
    langKeySuffix: 'transactions',
    group: 'assets',
    path: '/transactions',
    icon: 'bx bx-transfer',
    component: Transactions,
    leftMenu: true,
  },
  {
    langKeySuffix: 'wallet',
    group: 'assets',
    path: '/wallet',
    icon: 'bx bx-wallet',
    component: Wallet,
    leftMenu: true,
  },

  //--- internal
  {
    name: 'Developer Assets',
    menuItem: 'DevAssets',
    group: 'internal',
    path: '/devAssets',
    icon: 'mdi mdi-developer-board',
    component: DevAssets,
    leftMenu: true,
  },
];

export const isPageAvailable = (page: Page): boolean => {
  return !page.onlyDev || (page.onlyDev && import.meta.env.DEV);
};

export const getCurrentPage = (location: string): Page | null => {
  const matchingPage = PAGES.find((page) => {
    const re = new RegExp(`^${page.path.replace(/\/:[a-zA-Z]+/g, '(/?[^/]+)?')}$`);
    return location.match(re) != null;
  });

  return matchingPage || null;
};

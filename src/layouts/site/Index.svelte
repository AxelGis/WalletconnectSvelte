<script lang="ts">
  import { onMount } from 'svelte';
  import { Alert, Button, Container } from 'sveltestrap';
  import { location } from 'svelte-spa-router';
  import { _ } from 'svelte-i18n';

  import Alerts from '../../components/helpers/Alerts.svelte';
  import { sendSiweMessage, user } from '../../stores/auth';
  import {
    chain,
    connected,
    getWalletBalance,
    setupWalletConnect,
  } from '../../stores/wallet';

  import Breadcrumbs from 'src/components/helpers/Breadcrumb.svelte';
  import { PAGES, type Page } from 'src/routes';

  import Footer from './Footer.svelte';
  import Header from './Header.svelte';
  import Navbar from './Navbar.svelte';

  let leftSideBarTheme = 'dark';
  let leftSidebarType = 'large';

  onMount(() => {
    changeLeftSidebarTheme(leftSideBarTheme);
    changeLeftSidebarType(leftSidebarType);

    setupWalletConnect();
  });

  function changeLeftSidebarTheme(value: string) {
    if (document.body) document.body.setAttribute('data-sidebar', value);
  }

  function changeLeftSidebarType(value: string) {
    if (document.body) document.body.setAttribute('data-sidebar-size', value);
  }

  $: if ($chain?.id) {
    getWalletBalance();
  }
  let page: Page;

  $: if ($location) page = PAGES.find((p) => p.path === $location);
</script>

<div id="layout-wrapper">
  <Header />
  <Navbar />
  <Alerts />
  <div class="main-content" id="maincontent">
    <div class="page-content">
      {#if $user}
        <slot />
      {:else if $connected}
        <Alert color="primary">
          {$_('auth.wallet.needAuthorization')}
          <Button on:click="{() => sendSiweMessage(true)}">{$_('auth.button')}</Button>
        </Alert>
      {:else}
        <Alert color="primary">{$_('auth.notAuthorized')}</Alert>
      {/if}
    </div>
  </div>
  <Footer />
</div>

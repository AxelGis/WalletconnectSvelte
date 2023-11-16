<script lang="ts">
  import { _ } from 'svelte-i18n';
  import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge,
  } from 'sveltestrap';

  import { logout, user } from '../../stores/auth';
  import { chain, balance, connectWallet, connected } from '../../stores/wallet';
</script>

{#if $user}
  <Dropdown class="dropdown d-inline-block">
    <DropdownToggle
      id="page-header-user-dropdown"
      class="btn header-item headerbtn"
      color=""
      tag="button">
      <img
        class="rounded-circle header-profile-user"
        alt="Header Avatar"
        src="/assets/images/users/avatar-1.jpg" />
      <span class="d-none d-xl-inline-block ms-1 limited-content"> {$user.address} </span>
      <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
    </DropdownToggle>

    <DropdownMenu class="dropdown-menu-end">
      <DropdownItem>
        <i class="mdi mdi-currency-btc text-muted font-size-16 align-middle me-1"></i>
        <span class="align-middle">{$user.address}</span>
      </DropdownItem>

      {#if $balance.length}
        {#each $balance as balanceItem}
          <DropdownItem>
            <i class="mdi mdi-currency-btc text-muted font-size-16 align-middle me-1"></i>
            <span class="align-middle">{balanceItem.formatted} {balanceItem.symbol}</span>
          </DropdownItem>
        {/each}
      {/if}

      <div class="dropdown-divider"></div>
      <DropdownItem on:click="{connectWallet}"
        ><i class="mdi mdi-logout text-muted font-size-16 align-middle me-1"></i>
        <span class="align-middle">
          {#if $connected}
            <span>{$_('auth.wallet.changeNetwork')}</span>
            <Badge class="badge-soft-secondary">{$chain?.name}</Badge>
          {:else}
            <span>{$_('auth.wallet.connectWallet')}</span>
          {/if}
        </span>
      </DropdownItem>

      <div class="dropdown-divider"></div>
      <DropdownItem on:click="{logout}"
        ><i class="mdi mdi-logout text-muted font-size-16 align-middle me-1"></i>
        <span class="align-middle">{$_('navbar.logout.text')}</span>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
{:else}
  <Dropdown class="dropdown d-inline-block">
    <DropdownToggle
      id="page-header-user-dropdown"
      class="btn header-item headerbtn"
      color=""
      tag="button"
      on:click="{connectWallet}">
      <i class="mdi mdi-currency-btc text-muted font-size-16 align-middle me-1"></i>
      <span class="d-none d-xl-inline-block ms-1">{$_('navbar.connectWallet.text')}</span>
    </DropdownToggle>
  </Dropdown>
{/if}

<style lang="scss">
  .limited-content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 16ch;
    line-height: 1;
    vertical-align: middle;
  }
</style>

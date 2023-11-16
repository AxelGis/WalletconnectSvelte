<script lang="ts">
  import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';

  import { currency } from '../../stores/globalStoreList';
  import { currencies } from '../../../data/currency';

  let isOpen = false;
  export let selectedCurrency = localStorage.getItem('CURRENCY') || 'usd';
  export let selectedCurrencyLabel = localStorage.getItem('CURRENCY_LABEL') || '$';

  function handleCurrencyChange(cur, label) {
    currency.set(cur);
    selectedCurrency = cur;
    selectedCurrencyLabel = label;
    localStorage.setItem('CURRENCY', cur);
    localStorage.setItem('CURRENCY_LABEL', label);
  }
</script>

<Dropdown class="d-inline-block" {isOpen} toggle="{() => (isOpen = !isOpen)}">
  <DropdownToggle class="btn header-item headerbtn" color="" tag="button">
    {selectedCurrencyLabel}
  </DropdownToggle>
  <DropdownMenu class="language-switch dropdown-menu-end">
    {#each currencies as cur}
      <DropdownItem
        class="{`notify-item language ${
          selectedCurrency === cur.value ? 'active' : 'none'
        }`}"
        on:click="{() => handleCurrencyChange(cur.value, cur.label)}">
        <span class="align-middle">
          {cur.label}
        </span>
      </DropdownItem>
    {/each}
  </DropdownMenu>
</Dropdown>

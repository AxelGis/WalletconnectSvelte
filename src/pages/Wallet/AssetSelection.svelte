<script lang="ts">
  import { Input, InputGroup, Label } from 'sveltestrap';
  import { onDestroy } from 'svelte';

  import Dropdown from 'src/components/basic/Dropdown/Dropdown.svelte';
  import { currency } from 'src/stores/globalStoreList';

  export let assetLabel;
  export let tokenLabel;
  export let placeholder;
  export let assets;

  let values = [
    {
      currency: 'usd',
      sign: '$',
      value: '1,001',
    },
    {
      currency: 'mbtc',
      sign: '𝔪₿',
      value: '0,034',
    },
    {
      currency: 'meth',
      sign: '𝔪Ξ',
      value: '0,54',
    },
  ];

  let internalCurrency = 'usd';
  let depositValue = values[0];
  let withdrawValue = values[0];

  const unsubscribe = currency.subscribe((value) => {
    internalCurrency = value;
    depositValue = values.find((el) => el.currency === internalCurrency);
    withdrawValue = values.find((el) => el.currency === internalCurrency);
  });

  onDestroy(unsubscribe);
</script>

<div class="float-end ms-2">
  <h5 class="font-size-14">
    <i class="bx bx-wallet text-primary font-size-16 align-middle me-1"></i>{' '}
    ~{depositValue.sign + depositValue.value}
  </h5>
</div>
<div>
  <Label>{assetLabel}:</Label>
  <InputGroup class="mb-3">
    <Label class="input-group-text">{tokenLabel}</Label>
    <Dropdown
      class="mw-90"
      options="{assets}"
      value="{assets.find((v) => v.default)?.value}" />
    <Input type="text" class="form-control" {placeholder} />
  </InputGroup>
</div>

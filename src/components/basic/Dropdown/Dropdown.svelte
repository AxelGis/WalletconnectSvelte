<script lang="ts">
  import type { DropdownOption } from './interface';

  export let options: DropdownOption[] = [];
  export let value: string = null;
</script>

<select class="form-select form-select-sm {$$props.class}" bind:value>
  {#each options as opt}
    <option disabled="{opt.disabled}" value="{opt.value}">{opt.label}</option>
  {/each}
</select>

<style lang="scss">
  .dropdown {
    width: auto;
  }
</style>

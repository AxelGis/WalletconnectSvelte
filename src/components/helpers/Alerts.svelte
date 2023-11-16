<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { Alert, Popover } from 'sveltestrap';

  import { alerts } from '../../stores/alerts';

  let isOpens: Record<string, boolean> = {};

  const hidePopover = (key: number) => {
    const title: string = `alert-${key}`;
    Object.keys(isOpens)
      .filter((k) => k !== title)
      .map((k) => (isOpens[k] = false));
    if (isOpens[title]) setTimeout(() => (isOpens[title] = false));
  };
</script>

<div class="alert-block">
  {#each $alerts as alert, key}
    <Alert color="{alert.type}" dismissible>
      <button
        id="{`alert-${key}`}"
        class="{`alert-button ${alert.info?.response ? 'alert-link' : ''}`}"
        tabindex="{0}"
        on:click="{() => hidePopover(key)}">
        {alert.message}
      </button>
      {#if alert.info?.response}
        <Popover
          class="alert-popover"
          target="{`alert-${key}`}"
          placement="left"
          title="{$_('alerts.error.header')}"
          bind:isOpen="{isOpens[`alert-${key}`]}">
          <dl>
            <dt>{$_('alerts.error.url')}</dt>
            <dd>{alert.info.url}</dd>

            <dt>{$_('alerts.error.method')}</dt>
            <dd>{alert.info.method}</dd>

            <dt>{$_('alerts.error.errorCode')}</dt>
            <dd>{alert.info.response.errorCode}</dd>

            <dt>{$_('alerts.error.duration')}</dt>
            <dd>{alert.info.duration} ms</dd>

            <dt>{$_('alerts.error.errorMessage')}</dt>
            <dd>{alert.info.response.errorMessage}</dd>
          </dl>
        </Popover>
      {/if}
    </Alert>
  {/each}
</div>

<style lang="scss">
  .alert-block {
    position: fixed;
    top: 120px;
    right: 10px;
    z-index: 10000;
  }
  .alert-button {
    background-color: transparent;
    border: none;
    cursor: default;
  }
  .alert-link {
    cursor: pointer;
  }
</style>

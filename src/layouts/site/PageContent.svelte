<script lang="ts">
  import { Container } from 'sveltestrap';
  import { location } from 'svelte-spa-router';
  import { _ } from 'svelte-i18n';

  import Breadcrumbs from 'src/components/helpers/Breadcrumb.svelte';
  import { PAGES, getCurrentPage, type Page } from 'src/routes';

  let page: Page;

  $: if ($location) {
    page = getCurrentPage($location);
  }
</script>

<Container fluid>
  <slot name="breadcrumbs">
    <Breadcrumbs
      title="{$_(`menuitems.home.text`)}"
      breadcrumbItem="{page?.name ||
        $_(`menuitems.${page?.langKeySuffix}.breadcrumbs`)}" />
  </slot>

  <slot name="content" />
</Container>

<script lang="ts">
  import PageContent from 'src/layouts/site/PageContent.svelte';

  import MarketWidget from './Content.svelte';

  import './style.scss';
</script>

<PageContent>
  <MarketWidget slot="content" />
</PageContent>

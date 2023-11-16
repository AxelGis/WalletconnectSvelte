<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { Container, Row } from 'sveltestrap';
</script>

<Container fluid>
  <Row>{$_('pages.notFound.text')}</Row>
</Container>

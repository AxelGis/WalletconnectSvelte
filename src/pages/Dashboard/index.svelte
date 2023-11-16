<script lang="ts">
  import { Col, Container, Row } from 'sveltestrap';

  import Breadcrumbs from 'src/components/helpers/Breadcrumb.svelte';
  import Dropdown from 'src/components/basic/Dropdown/Dropdown.svelte';
  import { network, wallet } from 'src/stores';
  import MiniReportWidget from 'src/components/widgets/MiniReportWidget/MiniReportWidget.svelte';
  import TotalBalanceWidget from 'src/components/widgets/TotalBalanceWidget/TotalBalanceWidget.svelte';
  import PageContent from 'src/layouts/site/PageContent.svelte';
  import BalanceWidget from 'src/components/widgets/BalanceWidget/BalanceWidget.svelte';

  const networks = [
    { value: 'ALL', label: 'All networks' },
    { value: 'ETH', label: 'Ethereum' },
    { value: 'BNB', label: 'Binance', disabled: true },
  ];
  const wallets = [
    { value: 'ALL', label: 'All assets' },
    { value: 'protected_pool', label: 'Protected' },
    { value: 'original', label: 'Unprotected' },
  ];
</script>

<PageContent>
  <Breadcrumbs breadcrumbItem="Dashboard" title="Home" slot="breadcrumbs">
    <div slot="after_title" class="dropdowns">
      <Dropdown class="dropdown wallets " options="{wallets}" bind:value="{$wallet}" />
      <Dropdown
        class="dropdown network ms-2"
        options="{networks}"
        bind:value="{$network}" />
    </div>
  </Breadcrumbs>

  <Container fluid slot="content">
    <Row>
      <Col sm="12" xl="8" lg="8">
        <MiniReportWidget />
      </Col>
      <Col sm="12" xl="4" lg="4">
        <TotalBalanceWidget />
      </Col>
    </Row>

    <Row class="flex flex-wrap">
      <Col xxl="5">
        <BalanceWidget />
      </Col>
    </Row>
  </Container>
</PageContent>

<style lang="scss">
  .dropdowns {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }
</style>

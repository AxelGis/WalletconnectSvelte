<script lang="ts">
  import {
    CardBody,
    Card,
    Nav,
    NavItem,
    NavLink,
    CardTitle,
    TabContent,
    TabPane,
    InputGroup,
    Row,
    Col,
  } from 'sveltestrap';
  import { _ } from 'svelte-i18n';

  import ButtonContainer from 'src/components/basic/ButtonContainer.svelte';
  import Switcher from 'src/components/basic/Switcher.svelte';
  import PageContent from 'src/layouts/site/PageContent.svelte';

  import AssetSelection from './AssetSelection.svelte';

  let activeTab = '1';

  const depositAssets = [
    { value: 1, label: 'USDT', default: true },
    { value: 2, label: 'WBTC' },
    { value: 3, label: 'ETH' },
    { value: 4, label: 'OP' },
    { value: 5, label: 'UNI' },
  ];

  const withdrawAssets = [
    { value: 1, label: 'USDT', default: true },
    { value: 2, label: 'WBTC' },
    { value: 3, label: 'ETH' },
  ];
</script>

<Row>
  <Col xl="{6}" xxl="{4}">
    <Card>
      <CardBody>
        <CardTitle class="mb-4">{$_('menuitems.wallet.text')}</CardTitle>
        <Nav class="nav-tabs-custom">
          <NavItem>
            <NavLink on:click="{() => (activeTab = '1')}" active="{activeTab == '1'}">
              {$_('menuitems.wallet.deposittab')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink on:click="{() => (activeTab = '2')}" active="{activeTab == '2'}">
              {$_('menuitems.wallet.withdrawtab')}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent class="mt-4" style="max-height: 340px;">
          <TabPane tabId="1" class="{activeTab == '1' ? 'active' : ''}">
            <AssetSelection
              assets="{depositAssets}"
              assetLabel="{$_('menuitems.wallet.depositlabel')}"
              tokenLabel="{$_('menuitems.wallet.tokenlabel')}"
              placeholder="1000" />
            <ButtonContainer
              label="{$_('menuitems.wallet.depositbutton')}"
              class="w-md"
              color="success" />
          </TabPane>
          <TabPane tabId="2" class="{activeTab == '2' ? 'active' : ''}">
            <AssetSelection
              assets="{withdrawAssets}"
              assetLabel="{$_('menuitems.wallet.withdrawlabel')}"
              tokenLabel="{$_('menuitems.wallet.tokenlabel')}"
              placeholder="1000" />

            <InputGroup class="mb-3">
              <Switcher id="wallet-switcher" label="{$_('menuitems.wallet.switcher')}" />
            </InputGroup>

            <ButtonContainer
              label="{$_('menuitems.wallet.withdrawbutton')}"
              color="danger"
              class="btn btn-danger w-md" />
          </TabPane>
        </TabContent>
      </CardBody>
    </Card>
  </Col>
</Row>

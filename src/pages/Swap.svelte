<script lang="ts">
  import {
    Button,
    Col,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input,
    InputGroup,
    Label,
    Row,
  } from 'sveltestrap';
  import Decimal from 'decimal.js';

  import {
    getTokenAllowance,
    setTokenAllowance,
    swap,
  } from 'src/services/crypto/oneinch';

  import type { AddressString } from 'src/stores/wallet';

  let allowance: string = '0';
  let setAllowanceAmount: string = '0';
  let swapAmount: string = '0';
  let src: AddressString = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; //usdt
  let dst: AddressString = '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce'; //shiba
</script>

<div class="page-content">
  <Container fluid>
    <Row class="pt-3">
      <Col>Allowance: {allowance}</Col>
      <Col>
        <Button
          on:click="{async () => {
            allowance = await getTokenAllowance(src);
          }}">
          Get allowance
        </Button>
      </Col>
    </Row>
    <Row class="pt-3">
      <Col>
        <FormGroup>
          <Label for="exampleNumber">Set Allowance</Label>
          <Input
            bind:value="{setAllowanceAmount}"
            type="number"
            name="number"
            id="setAllowanceAmount"
            placeholder="Amount" />
        </FormGroup>
      </Col>
      <Col>
        <Button
          on:click="{() => setTokenAllowance(src, new Decimal(setAllowanceAmount))}">
          Set Allowance
        </Button>
      </Col>
    </Row>
    <Row class="pt-3">
      <Col>
        <FormGroup>
          <Label for="exampleNumber">From</Label>
          <InputGroup>
            <Dropdown>
              <DropdownToggle caret>Tokens</DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  on:click="{() => (src = '0xdAC17F958D2ee523a2206206994597C13D831ec7')}"
                  >USDT</DropdownItem>
                <DropdownItem
                  on:click="{() => (src = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')}"
                  >ETH</DropdownItem>
                <DropdownItem
                  on:click="{() => (src = '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce')}"
                  >SHIBA</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Input bind:value="{src}" id="src" placeholder="From" />
          </InputGroup>
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label for="exampleNumber">To</Label>
          <InputGroup>
            <Dropdown>
              <DropdownToggle caret>Tokens</DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  on:click="{() => (dst = '0xdAC17F958D2ee523a2206206994597C13D831ec7')}"
                  >USDT</DropdownItem>
                <DropdownItem
                  on:click="{() => (dst = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')}"
                  >ETH</DropdownItem>
                <DropdownItem
                  on:click="{() => (dst = '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce')}"
                  >SHIBA</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Input bind:value="{dst}" id="dst" placeholder="To" />
          </InputGroup>
        </FormGroup>
      </Col>
    </Row>
    <Row class="pt-3">
      <Col>
        <FormGroup>
          <Label for="exampleNumber">Swap Amount</Label>
          <Input
            bind:value="{swapAmount}"
            type="number"
            name="number"
            id="swapAmount"
            placeholder="Swap Amount" />
        </FormGroup>
      </Col>
      <Col>
        <Button on:click="{() => swap(src, dst, new Decimal(swapAmount))}">Swap</Button>
      </Col>
    </Row>
  </Container>
</div>

<style lang="scss">
</style>

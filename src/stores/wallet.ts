import { get, writable } from 'svelte/store';
import { createWeb3Modal, walletConnectProvider } from '@web3modal/wagmi';
import {
  disconnect,
  fetchBalance,
  getAccount,
  getNetwork,
  signMessage,
  type FetchBalanceResult,
  Chain,
  configureChains,
  createConfig,
  InjectedConnector,
  PrepareSendTransactionArgs,
  prepareSendTransaction,
  PrepareSendTransactionResult,
  sendTransaction,
} from '@wagmi/core';
import { publicProvider } from '@wagmi/core/providers/public';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { mainnet, polygon } from '@wagmi/core/chains';
import { SiweMessage } from 'siwe';

import { PP_BACKGROUND_COLOR, PP_COLOR } from '../constants/styles';
import { WALLET_DESCRIPTION, WALLET_ICON, WALLET_NAME } from '../constants/wallet';
import { getTokenBalances } from '../services/crypto/alchemy';

import { login, user } from './auth';
import { addError } from './alerts';

import type { Web3Modal } from '@web3modal/wagmi/dist/types/src/client';

export type CreateSiweMessage = {
  nonce: string;
  domain: string;
  uri: string;
  statement: string;
};

export type AddressString = `0x${string}`;

const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

let web3modal: Web3Modal;

export const connected = writable<boolean>(null);
export const address = writable<AddressString>(null);
export const chain = writable<Chain>(null);
export const balance = writable<FetchBalanceResult[]>([]);

/**
 * Show walletconnect dialog
 */
export const connectWallet = () => {
  web3modal.open();
};

/**
 * Disconnect wallet
 */
export const disconnectWallet = async () => {
  await disconnect();
  connected.set(false);
  address.set(null);
  chain.set(null);
};

/**
 * Check wallet is connected
 * @returns
 */
export const isConnected = () => {
  return web3modal && getAccount()?.isConnected;
};

/**
 * Get address from wallet
 * @returns
 */
export const getAddress = () => {
  return (web3modal && getAccount()?.address) || '0x0';
};

/**
 * Get chain from wallet
 * @returns
 */
export const getChain = () => {
  return web3modal && getNetwork()?.chain;
};

/**
 * Setup walletconnect options
 */
export const setupWalletConnect = async () => {
  //pp style in public/custom.css
  const style: CSSStyleDeclaration = getComputedStyle(document.body);
  const ppBgColor: string = style.getPropertyValue(PP_BACKGROUND_COLOR);
  const ppColor: string = style.getPropertyValue(PP_COLOR);
  const themeVariables = {
    '--w3m-accent': ppColor,
    '--w3m-color-mix': ppBgColor,
    '--w3m-color-mix-strength': 40,
    '--w3m-z-index': 10000,
  };

  const { chains, publicClient } = configureChains(
    [mainnet, polygon],
    [walletConnectProvider({ projectId: PROJECT_ID }), publicProvider()]
  );

  const metadata = {
    name: WALLET_NAME,
    description: WALLET_DESCRIPTION,
    url: window.location.origin,
    icons: [WALLET_ICON],
  };

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      new WalletConnectConnector({
        chains,
        options: { projectId: PROJECT_ID, showQrModal: false, metadata },
      }),
      new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    ],
    publicClient,
  });

  web3modal = createWeb3Modal({
    wagmiConfig,
    projectId: PROJECT_ID,
    chains,
    themeVariables,
  });

  web3modal.subscribeState((state) => {
    setVariables();
  });

  setVariables();

  await login();
};

/**
 * Set store variables
 */
const setVariables = async () => {
  const isWalletConnected: boolean = isConnected();
  const walletAddress: AddressString = getAddress();
  const walletChain: Chain = getChain();

  if (walletAddress && walletAddress !== '0x0') {
    const coinBalance: FetchBalanceResult = await fetchBalance({
      address: walletAddress,
    });
    const tokenBalances: FetchBalanceResult[] = await getTokenBalances(
      walletAddress,
      walletChain.id
    );

    balance.set([coinBalance, ...tokenBalances]);
  }

  connected.set(isWalletConnected);
  address.set(walletAddress);
  chain.set(walletChain);

  if (get(user) === null) {
    login();
  }
};

export const getWalletBalance = async () => {
  const walletAddress: AddressString = get(user)?.address;
  if (walletAddress && walletAddress !== '0x0' && web3modal) {
    const coinBalance: FetchBalanceResult = await fetchBalance({
      address: walletAddress,
    });
    const tokenBalances: FetchBalanceResult[] = await getTokenBalances(
      walletAddress,
      walletChain.id
    );

    balance.set([coinBalance, ...tokenBalances]);
  }
};

/**
 * Create message for SIWE
 * @returns
 */
export const createSiweMessage = ({
  nonce,
  domain,
  uri,
  statement,
}: CreateSiweMessage): string => {
  const addr: AddressString = get(address);
  const chn: Chain = get(chain);

  if (!addr || !chn) {
    return null;
  }

  const message = new SiweMessage({
    address: addr,
    chainId: chn.id,
    domain,
    statement,
    uri,
    version: '1',
    nonce,
  });
  return message.prepareMessage();
};

/**
 * Get personal sign from wallet
 * @param message
 * @returns
 */
export const signSiweMessage = async (message: string): Promise<AddressString> => {
  const sign = await signMessage({
    message,
  });
  return sign;
};

/**
 * Prepare and send transaction to wallet
 * @param tx
 * @returns
 */
export const prepareAndSendTransaction = async (
  tx: PrepareSendTransactionArgs
): Promise<string> => {
  try {
    const request: PrepareSendTransactionResult = await prepareSendTransaction(tx);
    const { hash } = await sendTransaction(request);
    return hash;
  } catch (err) {
    addError(err.message);
    return null;
  }
};

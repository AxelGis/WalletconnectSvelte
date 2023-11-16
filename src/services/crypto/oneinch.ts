import {
  type AddressString,
  getAddress,
  getChain,
  prepareAndSendTransaction,
} from '../../stores/wallet';
import { Api } from '../api';

import type Decimal from 'decimal.js';

type OneInchAllowance = {
  allowance: string;
};

type OneInchTx = {
  data: string;
  gasPrice: string;
  to: string;
  value: string;
  from?: string;
  gas?: bigint;
};

type OneInchSwapTx = {
  toAmount: string;
  tx: OneInchTx;
};

/**
 * Get token allowance
 * @param tokenAddress
 * @returns
 */
export const getTokenAllowance = async (tokenAddress: AddressString): Promise<string> => {
  const { allowance }: OneInchAllowance = await Api.post(
    '/crypto/1inch/getTokenAllowance',
    {
      chainId: getChain().id,
      tokenAddress,
      walletAddress: getAddress(),
    }
  );

  return allowance;
};

/**
 * Set token allowance
 * @param tokenAddress
 * @param amount
 * @returns
 */
export const setTokenAllowance = async (
  tokenAddress: AddressString,
  amount: Decimal
): Promise<string> => {
  const tx: OneInchTx = await Api.post('/crypto/1inch/setTokenAllowance', {
    chainId: getChain().id,
    tokenAddress,
    amount: amount.toString(),
  });

  return await prepareAndSendTransaction(tx);
};

/**
 * Swap tokens
 * @param src
 * @param dst
 * @param amount
 * @returns
 */
export const swap = async (
  src: AddressString,
  dst: AddressString,
  amount: Decimal
): Promise<string> => {
  const { tx }: OneInchSwapTx = await Api.post('/crypto/1inch/swap', {
    chainId: getChain().id,
    from: getAddress(),
    src,
    dst,
    amount: amount.toString(),
    slippage: '1',
  });

  return await prepareAndSendTransaction(tx);
};

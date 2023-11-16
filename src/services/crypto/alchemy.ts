import {
  Network,
  Alchemy,
  TokenBalance,
  TokenMetadataResponse,
  TokenBalancesResponseErc20,
  AlchemySettings,
} from 'alchemy-sdk';

import type { FetchBalanceResult } from '@wagmi/core';

const NetworkById: Record<number, Network> = {
  1: Network.ETH_MAINNET,
  137: Network.MATIC_MAINNET,
};

/**
 * Each network need create instance
 * @param network
 * @returns
 */
const getAlchemy = (network: number): Alchemy => {
  const settings: AlchemySettings = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    network: NetworkById[network],
  };

  return new Alchemy(settings);
};

/**
 * Get all non zero token balances of address
 * @param address
 * @param network
 * @returns
 */
export const getTokenBalances = async (
  address: string,
  network: number
): Promise<FetchBalanceResult[]> => {
  const alchemy: Alchemy = getAlchemy(network);

  const balances: TokenBalancesResponseErc20 = await alchemy.core.getTokenBalances(
    address
  );
  const nonZeroBalances: TokenBalance[] = balances.tokenBalances.filter(
    (token) => +token.tokenBalance > 0
  );

  const formattedBalances: FetchBalanceResult[] = await Promise.all(
    nonZeroBalances.map(async (token: TokenBalance) => {
      const metadata: TokenMetadataResponse = await alchemy.core.getTokenMetadata(
        token.contractAddress
      );

      const balance: number = +token.tokenBalance / Math.pow(10, metadata.decimals);

      return {
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        formatted: balance.toFixed(6),
        value: BigInt(token.tokenBalance),
      };
    })
  );

  return formattedBalances;
};

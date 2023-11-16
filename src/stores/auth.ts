import { _ } from 'svelte-i18n';
import { get, writable } from 'svelte/store';
import mobile from 'is-mobile';

import { Api, ApiError } from '../services/api';
import { generalErrorHandler } from '../services/errors';

import {
  AddressString,
  createSiweMessage,
  disconnectWallet,
  getAddress,
  getWalletBalance,
  signSiweMessage,
} from './wallet';
import { addError } from './alerts';

export type User = {
  userId: number;
  address: AddressString;
  iat: number;
  exp: number;
};

//delay to show sign message request after wallet connect. Need on mobile devices for waiting to return from wallet app to browser.
const GET_SIGN_DELAY: number = import.meta.env.VITE_GET_SIGN_DELAY || 2000;

const defaultUser: User | null = import.meta.env.VITE_SKIP_AUTH
  ? { userId: 1, address: '0x0', iat: 1, exp: 1 }
  : null;
export const user = writable<User>(defaultUser); //user auth data

const domain: string = window.location.host;
const origin: string = window.location.origin;
let nonce: string = null;
let waitingForSignMessage: boolean = false;

/**
 * Get profile or try to login
 */
export const login = async () => {
  const auth: User = await getProfile();
  if (auth === null) {
    await sendSiweMessage();
  }
};

/**
 * Set user to null and disconnect wallet
 * @returns
 */
export const logout = async () => {
  await disconnectWallet();
  user.set(null);
  await signOut();
  nonce = null;
};

/**
 * SignIn by address and personal sign
 * @param address
 * @param message
 * @param sign
 */
export const signIn = async (
  address: string,
  siwe_message: string,
  sign: string,
  nonce: string
) => {
  return await Api.post(`/auth/signIn`, {
    address,
    siwe_message,
    sign,
    nonce,
  });
};

/**
 * Send API signOut
 * @returns
 */
export const signOut = async () => {
  return await Api.get(`/auth/signOut`);
};

/**
 * Get nonce for address
 * @param address
 * @returns
 */
export const login = async () => {
  if (import.meta.env.VITE_SKIP_AUTH) return defaultUser;
  const auth: User = await getProfile();
  if (auth === null) {
    await sendSiweMessage();
  }
};

/**
 * Generate Siwe Message and sign it
 * Use try - catch, because signSiweMessagewe sometimes returns an error,
 * mainly related to the operation of the wallet and the loss of communication with json rpc
 */
export const sendSiweMessage = async (force: boolean = false) => {
  //prevent send multiple signs to wallet
  if (!force && waitingForSignMessage) {
    return;
  }

  waitingForSignMessage = true;
  try {
    const statement = get(_)('auth.wallet.signMessage');
    const authAddress: AddressString = getAddress();
    if (authAddress && authAddress !== '0x0') {
      nonce = nonce ?? (await getNonce(authAddress));
      const message: string = createSiweMessage({
        statement,
        domain,
        uri: origin,
        nonce,
      });
      if (message) {
        if (mobile()) {
          await new Promise((resolve) => setTimeout(resolve, GET_SIGN_DELAY));
        }
        const sign: AddressString = await signSiweMessage(message);
        if (!sign) {
          addError(get(_)('auth.wallet.signMessageError'));
          return;
        }

        //send request only if NOT authorized
        //sometimes we can send several requests via the signSiweMessage method
        //when a response from signSiweMessage arrives we may already be logged in, so we re-check here
        const auth: User = get(user);
        if (!auth) {
          await signIn(authAddress, message, sign, nonce).catch((err: ApiError) => {
            if (
              err.errorCode === 400 &&
              err.errorMessage === 'Nonce validation failed!'
            ) {
              nonce = null;
            }
          });
          await getProfile();
        }
      } else {
        addError(get(_)('auth.wallet.signMessageError'));
      }
    }
  } catch (err) {
    generalErrorHandler(err);
  } finally {
    waitingForSignMessage = false;
  }
};

/**
 * Get profile if signed in
 */
const getProfile = async (): Promise<User | null | undefined> => {
  const auth: User = await Api.get<User>(`/auth/profile`).catch((err: ApiError) => {
    if (err.errorCode === 401) {
      err.handled = true;
      return null; //not authorized, error not show
    }
  });
  user.set(auth);
  getWalletBalance();
  return auth;
};

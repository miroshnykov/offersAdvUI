import { DateTime } from 'luxon';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

let storageToken = localStorage.getItem('accessToken');

type SetTokensInput = {
  accessToken: string,
};

export const setTokens = (data: SetTokensInput): void => {
  storageToken = data.accessToken;
  localStorage.setItem('accessToken', data.accessToken);
};

export const logout = (): void => {
  storageToken = null;
  localStorage.removeItem('accessToken');
};

export const auth = (refreshUrl: string) => async (): Promise<string | null> => {
  storageToken = storageToken || localStorage.getItem('accessToken');
  if (storageToken) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken: any = jwt_decode(storageToken || '');

    if (accessToken && accessToken.exp < DateTime.now().toSeconds() - 10) {
      try {
        const res = await axios.post(refreshUrl, undefined, {
          withCredentials: true,
        });

        storageToken = res!.data!.accessToken;
        localStorage.setItem('accessToken', storageToken || '');
      } catch (e) {
        logout();
      }
    }
  } else {
    logout();
  }
  return storageToken;
};

import { AuthClient } from '@dfinity/auth-client';

export const signout = async () => {
  let authClient = await AuthClient.create();
  await authClient.logout();
};

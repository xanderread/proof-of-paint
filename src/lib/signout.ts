import { AuthClient } from '@dfinity/auth-client';

export const signout = async () => {
  const authClient = await AuthClient.create();
  await authClient.logout();
  window.location.reload();
};

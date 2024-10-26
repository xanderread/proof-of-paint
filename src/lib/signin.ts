import { AuthClient } from '@dfinity/auth-client';

export const signin = () => {
  return new Promise(async (resolve, reject) => {
    // create an auth client
    let authClient = await AuthClient.create();

    // start the login process and wait for it to finish
    authClient.login({
      identityProvider:
        process.env.DFX_NETWORK === 'ic'
          ? 'https://identity.ic0.app'
          : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
      onSuccess: resolve,
      onError: reject,
      windowOpenerFeatures: `toolbar=0,location=0,menubar=0,width=400,height=600,left=${window.screen.width / 2 - 200},top=${window.screen.height / 2 - 300}`,
    });
  });
};

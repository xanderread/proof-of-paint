import { AuthClient, InternetIdentityAuthResponseSuccess } from '@dfinity/auth-client';

export const signin = async () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<InternetIdentityAuthResponseSuccess>(async (resolve, reject) => {
    const authClient = await AuthClient.create();
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

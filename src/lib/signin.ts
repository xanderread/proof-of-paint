import { AuthClient, InternetIdentityAuthResponseSuccess } from '@dfinity/auth-client';

// @ts-expect-error BigInt is not defined in the browser
BigInt.prototype.toJSON = function() { return this.toString() }

const authenticateWithII = () => {
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

export const signin = async (prompt = false) => {
  const exists = localStorage.getItem('delegation');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let delegation: any;
  if (exists) {
    delegation = JSON.parse(exists);
  } else if (prompt) {
    const success = await authenticateWithII();
    delegation = success.delegations[0];
    localStorage.setItem('delegation', JSON.stringify(delegation));
  } else {
    throw new Error('No delegation found');
  }
  return delegation;
};

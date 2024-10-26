import { HttpAgent } from '@dfinity/agent';
import { AuthClient, InternetIdentityAuthResponseSuccess } from '@dfinity/auth-client';
import { createActor } from '../../declarations/backend';
import { User } from '../structs/User';

export const authenticate = async () => {
  const authClient = await AuthClient.create();
  const state = (await authClient.isAuthenticated()) ? 'authenticated' : 'unauthenticated';
  if (state === 'authenticated') {
    const identity = authClient.getIdentity();
    const agent = await HttpAgent.create({ identity });
    agent.fetchRootKey();
    const actor = createActor('bkyz2-fmaaa-aaaaa-qaaaq-cai', { agent });
    return new User(agent, actor);
  }

  return new User(null, null);
};

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

export const signout = async () => {
  const authClient = await AuthClient.create();
  await authClient.logout();
  window.location.reload();
};

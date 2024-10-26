import { HttpAgent, PublicKey } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { PartialIdentity } from '@dfinity/identity';
import { createActor } from '../declarations/backend';

export const authenticate = async (delegation?: PublicKey) => {
  if (delegation) {
    const principal = new PartialIdentity(delegation);
    const agent = await HttpAgent.create({ identity: principal });
    const actor = createActor('bkyz2-fmaaa-aaaaa-qaaaq-cai', { agent });
    return [agent, actor] as [HttpAgent, ReturnType<typeof createActor>];
  }

  const authClient = await AuthClient.create();
  const state = (await authClient.isAuthenticated()) ? 'authenticated' : 'unauthenticated';
  console.log('Auth state:', state);
  if (state === 'authenticated') {
    const identity = authClient.getIdentity();
    const agent = await HttpAgent.create({ identity });
    const actor = createActor('bkyz2-fmaaa-aaaaa-qaaaq-cai', { agent });
    return [agent, actor] as [HttpAgent, ReturnType<typeof createActor>];
  }
};

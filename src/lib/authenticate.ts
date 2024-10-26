import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId } from '../declarations/backend';

export const authenticate = async () => {
  const authClient = await AuthClient.create();
  const state = (await authClient.isAuthenticated()) ? 'authenticated' : 'unauthenticated';
  if (state === 'authenticated') {
    const identity = authClient.getIdentity();
    const agent = await HttpAgent.create({ identity });
    const actor = createActor(canisterId, { agent });
    return actor;
  }
};

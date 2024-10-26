import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId } from '../declarations/backend';

export const authenticate = async () => {
  const authClient = await AuthClient.create();
  const state = (await authClient.isAuthenticated()) ? 'authenticated' : 'unauthenticated';
  if (state === 'authenticated') {
    const identity = authClient.getIdentity();
    console.log('Authenticated as: ', identity.getPrincipal().toText());
    const agent = await HttpAgent.create({ identity });
    console.log('Agent: ', agent);
    console.log('Canister ID: ', canisterId, process.env);
    const actor = createActor('bd3sg-teaaa-aaaaa-qaaba-cai', { agent });
    console.log('Actor: ', actor);
    return actor;
  }
};

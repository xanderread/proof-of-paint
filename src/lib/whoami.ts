import type { Principal } from '@dfinity/principal';

import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../declarations/backend/backend.did";

export const whoami = async (actor: ActorSubclass<_SERVICE>) => {
    return new Promise<Principal>((resolve, reject) => {
        actor.whoAmI().then(resolve).catch(reject);
    });
}
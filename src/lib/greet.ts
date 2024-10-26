import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../declarations/backend/backend.did";

export const greet = (actor: ActorSubclass<_SERVICE>, input: string) => {
    return new Promise<string>((resolve, reject) => {
        actor.greet(input).then(resolve).catch(reject);
    });
};

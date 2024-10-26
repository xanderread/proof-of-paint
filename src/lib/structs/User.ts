import { ActorSubclass, HttpAgent } from '@dfinity/agent';
import { _SERVICE } from '../../declarations/backend/backend.did';
import { AssetManager } from '@dfinity/assets';

export class User {
  public agent: HttpAgent;
  public actor: ActorSubclass<_SERVICE>;
  public assetManager: AssetManager | null;
  public state: 'loading' | 'authenticated' | 'unauthenticated';

  constructor(agent: HttpAgent, actor: ActorSubclass<_SERVICE>) {
    this.agent = agent;
    this.actor = actor;
    if (agent && actor) {
        this.state = 'authenticated';
        this.assetManager = new AssetManager({ canisterId: 'bd3sg-teaaa-aaaaa-qaaba-cai', agent });
    }
    else {
        this.state = 'unauthenticated';
        this.assetManager = null;
    }
  }
}

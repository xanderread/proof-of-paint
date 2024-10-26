import { Ed25519KeyIdentity } from '@dfinity/identity';
import { ActorSubclass, HttpAgent } from '@dfinity/agent';
import { _SERVICE } from '../../declarations/backend/backend.did';
import { AssetManager } from '@dfinity/assets';

export class User {
  public agent: HttpAgent | null;
  public actor: ActorSubclass<_SERVICE> | null;
  public assetManager?: AssetManager;
  public state: 'loading' | 'authenticated' | 'unauthenticated';
  public isSetup: boolean;

  public alias: string;
  public walletAddress: string;

  private _principalId: string;

  get principalId(): string {
    return this._principalId;
  }

  constructor(agent: HttpAgent | null, actor: ActorSubclass<_SERVICE> | null) {
    this.actor = actor;
    this.agent = agent;

    if (agent && actor) {
      this.state = 'authenticated';
      this.assetManager = new AssetManager({ canisterId: 'bd3sg-teaaa-aaaaa-qaaba-cai', agent: agent ?? undefined });
    } else {
      this.state = 'unauthenticated';
      this.setupAgent();
    }

    this.isSetup = false;
    this.alias = '';
    this.walletAddress = '';

    this._principalId = '';
    this.getPrincipalId();
  }

  public async setup(alias: string, walletAddress: string): Promise<void> {
    this.alias = alias;
    this.walletAddress = walletAddress;
    this.isSetup = true;
  }

  private setupAgent = async () => {
    if (!this.agent) {
      const identity = Ed25519KeyIdentity.generate(new Uint8Array(Array(32).fill(0)));
      const isLocal = !window.location.host.endsWith('ic0.app');
      this.agent = await HttpAgent.create({
        host: isLocal ? `http://127.0.0.1:${window.location.port}` : 'https://ic0.app',
        identity,
      });
      this.agent.fetchRootKey();
      this.assetManager = new AssetManager({ canisterId: 'bd3sg-teaaa-aaaaa-qaaba-cai', agent: this.agent });
      await this.getPrincipalId();
    }
  };

  private async getPrincipalId(): Promise<string> {
    const principal = await this.agent?.getPrincipal();
    const id = principal?.toText() ?? '';

    if (id.length && !this._principalId) this._principalId = id;
    
    return this._principalId;
  }
}

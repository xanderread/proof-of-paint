# proof-of-paint

A decentralized street art gallery where artists upload photos and locations of their work to claim ownership and receive blockchain-based payments.

![alig-ali-g](https://github.com/user-attachments/assets/8a16fa2b-0712-4e1e-845a-d867491e61fe)

```bash
npm install
npm run build
dfx start --clean --background
dfx deploy
dfx generate
npm run build
dfx deploy
```

## Authenticating
Replace the principal in the following command with the principal of the user you want to authenticate. It will show up under agent.
```bash
dfx canister call frontend authorize '(principal "sje55-bbod6-oskig-l3htk-biti5-arb2k-i2bvd-mpbhd-kcxo6-f4xpw-eae")'
```

## Redeploying
```bash
npm run redeploy
```
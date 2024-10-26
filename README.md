## Proof of Paint
Claim, protect, and get rewarded for your street art.

### Problem

Thousands of talented street artists go unrecognized, have their work removed permanently, or, even worse, have [copycats impersonate them](https://artlyst.com/news/copycat-banksy-graffiti-flood-uk-mainland/).

### What we built

We built a <u>decentralised</u> street art gallery where artists can be authed <u>anonymously</u> and choose aliases. They can upload photos of their work and location to the chain, claim ownership and receive blockchain-based payments as tips from the public. This:

1. Protects artists from copycats
2. Gives street artists a platform to showcase their work and get paid
3. Most importantly, lets users explore the art and culture around them

### Demo 

-- Use the nice video app to make the demo

### FAQ



<details>
<summary><strong>Surely this exists already?</strong></summary>
We looked and looked... 👀 but couldn't find anything that addresses our issues with street art.

<b>Why NFTs don't solve this problem</b>
- We want to support the artists of the cool street art we walk past everyday...not buy an NFT.
- We want to find the art and culture around us.
- Thousands of NFT street art collections have wrongly been created and sold without the artist's permission, [as seen with Banksy's work](https://www.bbc.co.uk/news/technology-58399338#:~:text=Banksy's%20team%20told%20the%20BBC,actual%20artwork%20or%20its%20copyright.), leading to a lack of trust in the NFT market.

</details>

**Bounties chased**


**Tech Stack**


**Team**




THIS WILL BE DELETED ON SUBMISSION:
A decentralized street art gallery where artists upload photos and locations of their work to claim ownership and receive blockchain-based payments.



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

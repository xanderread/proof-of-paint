import '../styles/gallery.css';

import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { User } from '../lib/structs/User';
import { AssetManager } from '@dfinity/assets';
import { Metadata } from '../declarations/backend/backend.did';

const metadataFetcher = async (user: User) => {
  const metadata = (await user.actor?.getAllMetadata([], [])) ?? [];
  return metadata;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const assetFetcher = async (user: User) => {
  if (user.state !== 'authenticated') await wait(2000);
  const assets = (await user.assetManager?.list()) ?? [];
  return assets.filter((asset) => asset.key.startsWith('/uploads/'));
};

const like = async (user: User, key: string) => {
  await user.actor?.addLike(user.principalId, key);
};

export function Gallery() {
  const user = useContext(UserContext);
  const [assets, setAssets] = useState([] as Awaited<ReturnType<AssetManager['list']>>);
  const [metadataMap, setMetadataMap] = useState(new Map<string, Metadata>());

  const [date, setDate] = useState(Date.now());

  useEffect(() => {
    if (!user) return;
    assetFetcher(user).then(setAssets);

    if (user.state === 'authenticated') {
      metadataFetcher(user).then((metadata) => {
        const metadataMap = new Map<string, Metadata>();
        metadata.forEach((item) => metadataMap.set(item.photoKey.toString(), item));
        setMetadataMap(metadataMap);
      });
    }
  }, [user, date]);

  setInterval(() => {
    setDate(Date.now());
  }, 30_000);

  return (
    <div className="container">
      {assets.map((asset) => (
        <div className="img-container">
          <img key={asset.key} src={asset.key} alt={asset.key} className="gallery-image" />
          <button
            className="like-button"
            disabled={user.state !== 'authenticated'}
            onClick={async () => {
              await like(user, asset.key);
              setDate(Date.now());
            }}
          >
            <span role="img" aria-label="like">
              ❤️ {metadataMap.get(asset.key)?.likersPrincipalID.length}
            </span>
          </button>
          {metadataMap.get(asset.key) && (
            <div className="metadata">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${metadataMap.get(asset.key)?.gps.latitude},${metadataMap.get(asset.key)?.gps.longitude}`}
                target="_blank"
              >
                🗺️ Open in maps
              </a>
              <p>
                <a href={`https://etherscan.io/address/${metadataMap.get(asset.key)!.walletAddr}`} target="_blank">
                  {metadataMap.get(asset.key)!.alias}
                </a>
                | {new Date(parseInt((metadataMap.get(asset.key)?.time ?? 0n).toString())).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

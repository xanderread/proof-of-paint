import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { User } from '../lib/structs/User';
import { AssetManager } from '@dfinity/assets';

const fetcher = async (user: User) => {
  const assets = (await user.assetManager?.list()) ?? [];
  return assets.filter((asset) => asset.key.startsWith('/uploads/'));
};

export function Gallery() {
  const user = useContext(UserContext);
  const [assets, setAssets] = useState([] as Awaited<ReturnType<AssetManager['list']>>);

  useEffect(() => {
    if (!user || user.state !== 'authenticated') return;
    fetcher(user).then(setAssets);
  }, [user]);

  return (
    <div>
      {assets.map((asset) => (
        <img key={asset.key} src={asset.key} alt={asset.key} />
      ))}
    </div>
  );
}

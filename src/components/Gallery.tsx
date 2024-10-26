import '../styles/gallery.css';

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

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!user) return;
    fetcher(user).then(setAssets);
  }, [user, date]);

  setInterval(() => {
    setDate(new Date());
  }, 200);

  return (
    <div className="container">
      {assets.map((asset) => (
        <div className='img-container'>
          <img key={asset.key} src={asset.key} alt={asset.key} className="gallery-image" />
        </div>
      ))}
    </div>
  );
}

import { HttpAgent } from '@dfinity/agent';
import { AssetManager } from '@dfinity/assets';

export const upload = async (agent: HttpAgent, file: File) => {
  console.log('Uploading file: ', file);
  const assetManager = new AssetManager({ canisterId: 'bd3sg-teaaa-aaaaa-qaaba-cai', agent });
  console.log('Asset manager created: ', assetManager);

  const batch = assetManager.batch();
  const items = await Promise.all(
    [file].map(async (file) => {
      const key = await batch.store(file, { path: '/uploads', fileName: file.name });
      return { key, file };
    })
  );
  await batch.commit({ onProgress: ({ current, total }) => console.log(current / total) });

  return items;
};

import { User } from '../structs/User';

export const upload = async (user: User, file: File) => {
  if (user.state !== 'authenticated') throw new Error('User is not authenticated');
  if (!user.assetManager) throw new Error('User does not have an asset manager');

  const batch = user.assetManager.batch();
  const items = await Promise.all(
    [file].map(async (file) => {
      const key = await batch.store(file, { path: '/uploads', fileName: crypto.randomUUID() });
      return { key, file };
    })
  );
  await batch.commit({ onProgress: ({ current, total }) => console.log(current / total) });

  return items;
};

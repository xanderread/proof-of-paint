import { User } from '../structs/User';

export const upload = async (user: User, files: File[]) => {
  if (user.state !== 'authenticated') throw new Error('User is not authenticated');
  if (!user.assetManager) throw new Error('User does not have an asset manager');

  const batch = user.assetManager.batch();
  const items = await Promise.all(
    files.map(async (file) => {
      const key = await batch.store(file, { path: '/uploads', fileName: crypto.randomUUID() });
      return { key, file };
    })
  );
  await batch.commit({ onProgress: ({ current, total }) => console.info(current / total) });

  return items;
};

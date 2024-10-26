import { User } from '../structs/User';

export const upload = async (user: User, file: File) => {
  if (!user.assetManager) throw new Error('User is not authenticated');

  const batch = user.assetManager.batch();
  const items = await Promise.all(
    [file].map(async (file) => {
      const key = await batch.store(file, { path: '/uploads', fileName: file.name });
      return { key, file };
    })
  );
  await batch.commit({ onProgress: ({ current, total }) => console.log(current / total) });

  return items;
};

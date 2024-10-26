import { upload } from '../lib/api/upload';
import { useContext } from 'react';
import { UserContext } from '../App';
import { User } from '../lib/structs/User';

const uploadHandler = async (user: User, file: File) => {
  const result = await upload(user, file);
  const keys = result.map((item) => item.key);
  console.log('Uploaded keys:', keys);
  return keys;
}

export default function Upload() {
  const user = useContext(UserContext);

  if (user && user.state === 'authenticated') {
    return (
      <input
        type="file"

        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            uploadHandler(user, e.target.files[0]);
          }
        }}
      />
    );
  }
}

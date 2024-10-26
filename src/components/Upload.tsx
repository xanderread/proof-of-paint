import { upload } from '../lib/api/upload';
import { useContext } from 'react';
import { UserContext } from '../App';
import { User } from '../lib/structs/User';

const uploadHandler = async (user: User, file: File) => {
  const result = await upload(user, file);
  const keys = result.map((item) => item.key);
  return keys;
};

export default function Upload() {
  const user = useContext(UserContext);

  if (user && user.state === 'authenticated') {
    return (
      <div>
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          style={{ display: 'none' }}
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              for (let i = 0; i < e.target.files.length; i++) {
                uploadHandler(user, e.target.files[i]);
              }
            }
          }}
        />
        <label htmlFor="file-upload">
          <button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
            Upload Image
          </button>
        </label>
      </div>
    );
  }
}

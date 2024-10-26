import '../styles/upload.css';

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
      <div className="upload-btn-container">
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
          <button type="button" className="upload-btn" onClick={() => document.getElementById('file-upload')?.click()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16h6v-6h4l-7-7l-7 7h4zm-4 2h14v2H5z" />
            </svg>
          </button>
        </label>
      </div>
    );
  }
}

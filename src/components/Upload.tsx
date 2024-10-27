import '../styles/upload.css';

import { upload } from '../lib/api/upload';
import { useContext } from 'react';
import { UserContext } from '../App';
import { User } from '../lib/structs/User';

const uploadHandler = async (user: User, files: File[]) => {
  // Request GPS
  let [latitude, longitude] = [0, 0];
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });
  }
  const result = await upload(user, files);
  const keys = result.map((item) => item.key);

  const promises = [] as (Promise<boolean> | undefined)[];
  for (const key of keys) {
    promises.push(user.actor?.addMetadata(user.principalId, key, { latitude, longitude }, BigInt(Date.now())));
  }
  const out = await Promise.all(promises);

  console.log(out);

  // window.location.reload();
};

const invokeModal = () => {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'block';
}

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
              uploadHandler(user, Array.from(e.target.files));
            }
          }}
        />
        <label htmlFor="file-upload">
          <button
            type="button"
            className="upload-btn"
            onClick={() => {
              if (user.isSetup) document.getElementById('file-upload')?.click();
              else invokeModal();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16h6v-6h4l-7-7l-7 7h4zm-4 2h14v2H5z" />
            </svg>
          </button>
        </label>
      </div>
    );
  }
}

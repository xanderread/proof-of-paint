import { HttpAgent } from '@dfinity/agent';
import { upload } from '../lib/api/upload';
import { State } from '../lib/types';

export default function Upload(curstate: State, agent: HttpAgent) {
  if (curstate === 'authenticated' && agent) {
    return (
      <button
        onClick={async () => {
          const result = await upload(agent, new File(['hello'], 'hello.txt'));
          const keys = result.map((item) => item.key);
          console.log('Uploaded keys:', keys);
        }}
      >
        Upload
      </button>
    );
  }
}

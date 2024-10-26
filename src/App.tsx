import { useEffect, useState } from 'react';
import { backend, createActor } from './declarations/backend';
import './App.css';
import { authenticate } from './lib/authenticate';
import { signin } from './lib/signin';
import { ActorSubclass, HttpAgent } from '@dfinity/agent';
import { _SERVICE } from './declarations/backend/backend.did';
import { signout } from './lib/signout';
import { upload } from './lib/api/upload';

const signInFn = async (
  setActor: React.Dispatch<React.SetStateAction<ReturnType<typeof createActor>>>,
  setState: React.Dispatch<React.SetStateAction<State>>,
  setAgent: React.Dispatch<React.SetStateAction<HttpAgent | null>>,
  active: boolean
) => {
  const delegation = await signin(active);
  const [agent, actor] = (await authenticate(delegation)) ?? [null, null];

  if (actor) {
    console.log('Authenticated as', actor);
    window.localStorage.setItem('delegation', JSON.stringify(delegation));
    setAgent(agent);
    setActor(actor);
    setState('authenticated');
  } else {
    console.log('Not authenticated');
    setState('unauthenticated');
    window.localStorage.removeItem('delegation');
  }
};

const signOutButtonClick = async (
  setActor: React.Dispatch<React.SetStateAction<ActorSubclass<_SERVICE>>>,
  setState: React.Dispatch<React.SetStateAction<State>>
) => {
  await signout();
  setActor(backend);
  setState('unauthenticated');
};

function App() {
  const [state, setState] = useState('loading' as State);
  const [actor, setActor] = useState(backend);
  const [agent, setAgent] = useState(null as HttpAgent | null);

  useEffect(() => {
    signInFn(setActor, setState, setAgent, false);
  }, []);

  return (
    <>
      {state === 'loading' || state === 'unauthenticated' ? (
        <button
          onClick={() => {
            signInFn(setActor, setState, setAgent, true);
          }}
        >
          Sign in
        </button>
      ) : (
        <button
          onClick={() => {
            signOutButtonClick(setActor, setState);
          }}
        >
          Sign out
        </button>
      )}
      <p>State: {state}</p>
      <p>Actor: {JSON.stringify(actor) || 'None'}</p>
      <p>Agent: {JSON.stringify(agent) || 'None'}</p>
      {state === 'authenticated' && agent && (
        <button
          onClick={async () => {
            const result = await upload(agent, new File(['hello'], 'hello.txt'));
            console.log('Upload result:', result);
          }}
        >
          Upload
        </button>
      )}
    </>
  );
}

export default App;

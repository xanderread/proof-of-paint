import { useEffect, useState } from 'react';
import { backend, createActor } from './declarations/backend';
import './App.css';
import { authenticate } from './lib/authenticate';
import { signin } from './lib/signin';
import { ActorSubclass, HttpAgent } from '@dfinity/agent';
import { _SERVICE } from './declarations/backend/backend.did';
import { signout } from './lib/signout';

import Upload from './components/Upload';
import { State } from './lib/types';

const signInFn = async (
  setActor: React.Dispatch<React.SetStateAction<ReturnType<typeof createActor>>>,
  setState: React.Dispatch<React.SetStateAction<State>>,
  setAgent: React.Dispatch<React.SetStateAction<HttpAgent | null>>,
  active: boolean
) => {
  const [agent, actor] = (await authenticate()) ?? [null, null];

  if (agent && actor) {
    setAgent(agent);
    setActor(actor);
    setState('authenticated');
  } else if (active) {
    setState('loading');
    await signin();
    signInFn(setActor, setState, setAgent, false);
  } else {
    setState('unauthenticated');
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
      <Upload state={state} agent={agent} />
    </>
  );
}

export default App;

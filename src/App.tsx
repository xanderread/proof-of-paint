import { useEffect, useState } from 'react';
import { backend } from './declarations/backend';
import './App.css';
import { authenticate } from './lib/authenticate';
import { signin } from './lib/signin';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE } from './declarations/backend/backend.did';
import { signout } from './lib/signout';

const signInFn = async (
  setActor: React.Dispatch<React.SetStateAction<ActorSubclass<_SERVICE>>>,
  setState: React.Dispatch<React.SetStateAction<State>>,
  active: boolean
) => {
  const delegation = await signin(active);
  const actor = await authenticate();

  window.localStorage.setItem('delegation', JSON.stringify(delegation));

  if (actor) {
    console.log('Authenticated as', actor);

    setActor(actor);
    setState('authenticated');
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

  useEffect(() => {
    signInFn(setActor, setState, false);
  }, []);

  return (
    <>
      {state === 'loading' || state === 'unauthenticated' ? (
        <button
          onClick={() => {
            signInFn(setActor, setState, true);
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
    </>
  );
}

export default App;

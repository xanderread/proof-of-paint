import { useState } from 'react';
import { backend } from './declarations/backend';
import './App.css';
import { authenticate } from './lib/authenticate';
import { signin } from './lib/signin';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE } from './declarations/backend/backend.did';
import { greet } from './lib/greet';
import { signout } from './lib/signout';

const signInButtonClick = async (
  setActor: React.Dispatch<React.SetStateAction<ActorSubclass<_SERVICE>>>,
  setState: React.Dispatch<React.SetStateAction<State>>
) => {
  const delegation = await signin();
  const actor = await authenticate();

  window.localStorage.setItem('delegation', JSON.stringify(delegation));

  if (actor) {
    console.log('Authenticated as', await greet(actor, 'Hello'), actor);

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

  return (
    <>
      {state === 'loading' || state === 'unauthenticated' ? (
        <button
          onClick={() => {
            signInButtonClick(setActor, setState);
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

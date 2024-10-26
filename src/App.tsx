import { useState } from 'react';
import { backend } from './declarations/backend';
import './App.css';
import { authenticate } from './lib/authenticate';
import { signin } from './lib/signin';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE } from './declarations/backend/backend.did';

const signInButtonClick = async (
  setActor: React.Dispatch<React.SetStateAction<ActorSubclass<_SERVICE>>>,
  setState: React.Dispatch<React.SetStateAction<State>>
) => {
  const out = await signin();
  console.log('Sign in attempt: ', out);
  const actor = await authenticate();

  if (actor) {
    setActor(actor);
    setState('authenticated');
  }
};

function App() {
  const [state, setState] = useState('loading' as State);
  const [actor, setActor] = useState(backend);

  return (
    <>
      <button
        onClick={() => {
          signInButtonClick(setActor, setState);
        }}
      >
        Sign in
      </button>
      <p>State: {state}</p>
      <p>Actor: {actor?.toString() || 'None'}</p>
    </>
  );
}

export default App;

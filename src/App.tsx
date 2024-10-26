import { useState } from 'react';
import { backend } from './declarations/backend';
import './App.css';
import { authenticate } from './lib/authenticate';
import { greet } from './lib/greet';

function App() {
  const [state, setState] = useState('loading' as State);
  const [greeted, setGreeted] = useState<string | null>(null);
  const [actor, setActor] = useState(backend);

  authenticate().then((actor) => {
    if (actor) {
      setActor(actor);
      greet(actor, 'world').then((greeted) => {
        setGreeted(greeted);
        setState('authenticated');
      });
    }
  });

  return (
    <>
      <p>State: {state}</p>
      <p>Actor: {actor?.toString() || 'None'}</p>
      <p>Greeted: {greeted}</p>  
    </>
  );
}

export default App;

import { useState } from 'react';
import { backend } from './declarations/backend';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { authenticate } from './lib/authenticate';
import { greet } from './lib/greet';

function App() {
  const [_greeted, setGreeted] = useState<string | null>(null);
  const [_actor, setActor] = useState(backend);

  authenticate().then((actor) => {
    if (actor) {
      setActor(actor);
      greet(actor, 'world').then((greeted) => {
        setGreeted(greeted);
      });
    }
  });

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;

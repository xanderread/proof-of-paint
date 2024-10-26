import { useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId } from './declarations/backend';
import { HttpAgent } from '@dfinity/agent';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

const authenticate = async () => {
  const authClient = await AuthClient.create();
  const state = (await authClient.isAuthenticated()) ? 'authenticated' : 'unauthenticated';
  if (state === 'authenticated') {
    const identity = authClient.getIdentity();
    // const agent = new HttpAgent({ identity });
    const agent = await HttpAgent.create({ identity });
    const actor = createActor(canisterId, { agent });
    return actor;
  }
}

function App() {
  const [count, setCount] = useState(0);

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
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;

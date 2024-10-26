import React, { createContext, useEffect, useState } from 'react';

import { authenticate, signin, signout } from './lib/util/authenticate';
import Upload from './components/Upload';
import { User } from './lib/structs/User';
import { Gallery } from './components/Gallery';

const signInFn = async (setUser: React.Dispatch<React.SetStateAction<User | null>>, active: boolean) => {
  const user = (await authenticate()) ?? null;
  setUser(user);

  if (!user && active) {
    await signin();
    signInFn(setUser, false);
  }
};

const signOutButtonClick = async (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  await signout();
  setUser(null);
};

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<User | null>(null);

function App() {
  const [user, setUser] = useState(null as User | null);

  useEffect(() => {
    signInFn(setUser, false);
  }, []);

  return (
    <>
      {(!user || user.state === 'unauthenticated') ? (
        <button onClick={() => signInFn(setUser, true)}>Sign in</button>
      ) : (
        <button
          onClick={() => {
            signOutButtonClick(setUser);
          }}
        >
          Sign out
        </button>
      )}
      {user && user.state === 'authenticated' && (
        <UserContext.Provider value={user}>
          <p>State: {user.state}</p>
          <p>Actor: {JSON.stringify(user.actor) || 'None'}</p>
          <p>Agent: {JSON.stringify(user.agent) || 'None'}</p>
          <Upload />
          <Gallery />
        </UserContext.Provider>
      )}
    </>
  );
}

export default App;

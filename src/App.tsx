import React, { createContext, useEffect, useState } from 'react';

import { authenticate, signin, signout } from './lib/util/authenticate';
import Upload from './components/Upload';
import { User } from './lib/structs/User';
import { Gallery } from './components/Gallery';

const signInFn = async (setUser: React.Dispatch<React.SetStateAction<User>>, active: boolean) => {
  const user = (await authenticate()) ?? new User(null, null);
  setUser(user);

  if (!user && active) {
    await signin();
    signInFn(setUser, false);
  }
};

const signOutButtonClick = async (setUser: React.Dispatch<React.SetStateAction<User>>) => {
  await signout();
  setUser(new User(null, null));
};

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<User>(new User(null, null));

function App() {
  const [user, setUser] = useState(new User(null, null));
  const [principal, setPrincipal] = useState('');

  useEffect(() => {
    signInFn(setUser, false);
  }, []);

  useEffect(() => {
    if (user && user.state === 'authenticated') {
      const identity = user.agent?.config.identity;
      Promise.resolve(identity).then((identity) => {
        setPrincipal(identity?.getPrincipal().toText() ?? '');
      });
    }
  }, [user]);

  return (
    <>
      {!user || user.state === 'unauthenticated' ? (
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
      {user && (
        <UserContext.Provider value={user}>
          <p>State: {user.state}</p>
          <p>Actor: {JSON.stringify(user.actor) || 'None'}</p>
          <p>Principal: {principal || 'None'}</p>
          {user.state === 'authenticated' && <Upload />}
          <Gallery />
        </UserContext.Provider>
      )}
    </>
  );
}

export default App;

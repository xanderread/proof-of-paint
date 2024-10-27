import './styles/app.css';
import React, { createContext, useEffect, useState } from 'react';
import proofOfPaymentLogo from './assets/proofofpaymentlogo.gif';

import { authenticate, signin, signout } from './lib/util/authenticate';
import Upload from './components/Upload';
import { User } from './lib/structs/User';
import { Gallery } from './components/Gallery';
import SetupArtistModal from './components/SetupArtist';

const signInFn = async (setUser: React.Dispatch<React.SetStateAction<User>>, active: boolean) => {
  const user = (await authenticate()) ?? new User(null, null);
  setUser(user);

  if (!user.actor && active) {
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
      <div className="header">
        <div className="logo-container">
          <img src={proofOfPaymentLogo} alt="Proof of Payment Logo" className="logo" />
        </div>
        <div className="buttons">
          {!user || user.state === 'unauthenticated' ? (
            <button className="account-btn sign-in-btn" onClick={() => signInFn(setUser, true)}>
              Sign in
            </button>
          ) : (
            <button
              className="account-btn sign-out-btn"
              onClick={() => {
                signOutButtonClick(setUser);
              }}
            >
              Sign out
            </button>
          )}
        </div>
      </div>
      <UserContext.Provider value={user}>
        {user && (
          <div className="debug">
            <p>State: {user.state}</p>
            <p>Actor: {JSON.stringify(user.actor) || 'None'}</p>
            <p>Principal: {principal || 'None'}</p>
          </div>
        )}
        {user.state === 'authenticated' && <Upload />}
        <Gallery />
        <SetupArtistModal />
      </UserContext.Provider>
    </>
  );
}

export default App;

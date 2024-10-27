import '../styles/modal.css';

import { useContext, useState } from 'react';
import { UserContext } from '../App';

export default function SetupArtistModal() {
  const user = useContext(UserContext);
  const [alias, setAlias] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleSave = async () => {
    await user.actor?.addArtist(user.principalId, alias, walletAddress);
    document.getElementById('modal')!.style.display = 'none';
    window.location.reload();
  };

  const handleCancel = () => {
    document.getElementById('modal')!.style.display = 'none';
  };

  return (
    <div id="modal" className="modal-overlay" style={{ display: 'none' }}>
      <div className="modal-content">
        <h2 className="modal-title">Sign up</h2>
        <div className="modal-body">
          <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Alias" />

          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Wallet address"
          />
        </div>
        <div className="modal-button-container">
          <button onClick={handleCancel} className="modal-button cancel-btn">
            Cancel
          </button>
          <button onClick={handleSave} className="modal-button">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

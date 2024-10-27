import { useContext, useState } from 'react';
import { UserContext } from '../App';
import './SetupArtistModal.css';

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
    <div id="modal" className="modal-overlay" style={{ display: 'none',  }}>
      <div className="modal-content">
        <h2 className="modal-title">Enter Artist Details</h2>
        <div className="modal-body">
          <label>
            Alias:
            <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Enter alias" />
          </label>
          <label>
            Wallet Address:
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
            />
          </label>
        </div>
        <div>
          <button onClick={handleSave} className="modal-button">Save</button>
          <button onClick={handleCancel} className="modal-button">Back</button>
        </div>
      </div>
    </div>
  );
}

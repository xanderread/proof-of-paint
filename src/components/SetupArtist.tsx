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

  return (
    <div id="modal" className="modal" style={{ display: 'none' }}>
      <div className="modal-content">
        <h2>Enter Artist Details</h2>
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
        <div>
          <button onClick={handleSave}>Save</button>
          <button>Cancel</button>
        </div>
      </div>
    </div>
  );
}

import { useContext, useState } from 'react';
import { UserContext } from '../App';

export default function SetupArtistModal() {
  const user = useContext(UserContext);
  const [alias, setAlias] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleSave = () => {
    console.log("Alias:", alias);
    console.log("Wallet Address:", walletAddress);
  };

  console.log(user);

  return (
    <div id="modal" className="modal" style={{ display: 'none' }}>
      <div className="modal-content">
      <h2>Enter Artist Details</h2>
            <label>
              Alias:
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Enter alias"
                // style={inputStyle}
              />
            </label>
            <label>
              Wallet Address:
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter wallet address"
                // style={inputStyle}
              />
            </label>
            <div style={{ marginTop: '20px' }}>
              <button onClick={handleSave} style={buttonStyle}>Save</button>
              <button onClick={closeModal} style={{ ...buttonStyle, marginLeft: '10px' }}>Cancel</button>
            </div>
      </div>
    </div>
  );
}

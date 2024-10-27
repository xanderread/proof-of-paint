import { useContext } from 'react';
import { UserContext } from '../App';

export default function SetupArtistModal() {
  const user = useContext(UserContext);

  console.log(user);

  return (
    <div id="modal" className="modal" style={{ display: 'none' }}>
      <div className="modal-content">{/* Input for Artist alias and wallet and save button that calls  */}</div>
    </div>
  );
}

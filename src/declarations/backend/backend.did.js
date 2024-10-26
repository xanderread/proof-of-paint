export const idlFactory = ({ IDL }) => {
  const ArtistDetails = IDL.Record({
    'alias' : IDL.Text,
    'walletAddress' : IDL.Text,
  });
  const GPS = IDL.Record({
    'latitude' : IDL.Float64,
    'longitude' : IDL.Float64,
  });
  const Time = IDL.Int;
  const PhotoUploadMetadata = IDL.Record({
    'gps' : GPS,
    'date' : Time,
    'artist' : ArtistDetails,
  });
  const Main = IDL.Service({
    'addMetadata' : IDL.Func(
        [IDL.Text, ArtistDetails, GPS, Time, IDL.Text],
        [],
        [],
      ),
    'addVote' : IDL.Func([IDL.Text, IDL.Text, IDL.Bool], [], ['query']),
    'getAllStortedVotes' : IDL.Func([IDL.Text], [IDL.Nat, IDL.Nat], ['query']),
    'getMetadata' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(PhotoUploadMetadata)],
        ['query'],
      ),
  });
  return Main;
};
export const init = ({ IDL }) => { return []; };

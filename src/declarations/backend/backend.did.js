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
    'id' : IDL.Text,
    'gps' : GPS,
    'date' : Time,
    'assetLink' : IDL.Text,
    'artist' : ArtistDetails,
  });
  const Main = IDL.Service({
    'addMetadata' : IDL.Func(
        [IDL.Text, ArtistDetails, GPS, Time, IDL.Text],
        [],
        [],
      ),
    'getMetadata' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(PhotoUploadMetadata)],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'listAllMetadata' : IDL.Func([], [IDL.Vec(PhotoUploadMetadata)], ['query']),
    'whoAmI' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return Main;
};
export const init = ({ IDL }) => {
  return [IDL.Record({ 'phrase' : IDL.Text })];
};

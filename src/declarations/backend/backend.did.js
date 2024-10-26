export const idlFactory = ({ IDL }) => {
  const GPS = IDL.Record({
    'latitude' : IDL.Float64,
    'longitude' : IDL.Float64,
  });
  const Time = IDL.Int;
  const Metadata = IDL.Record({
    'gps' : GPS,
    'time' : Time,
    'photoKey' : IDL.Text,
    'likersPrincipalID' : IDL.Vec(IDL.Text),
    'principalID' : IDL.Text,
  });
  const Artist = IDL.Record({
    'photoKeys' : IDL.Vec(IDL.Text),
    'alias' : IDL.Text,
    'walletAddr' : IDL.Text,
  });
  const Main = IDL.Service({
    'addArtist' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    'addLike' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'addMetadata' : IDL.Func([IDL.Text, IDL.Text, GPS, Time], [IDL.Bool], []),
    'getAllMetadata' : IDL.Func(
        [IDL.Opt(Time), IDL.Opt(Time)],
        [IDL.Vec(Metadata)],
        ['query'],
      ),
    'getAllMetadataByArtist' : IDL.Func([IDL.Text], [IDL.Vec(Metadata)], []),
    'getArtist' : IDL.Func([IDL.Text], [IDL.Opt(Artist)], ['query']),
    'getMetadata' : IDL.Func([IDL.Text], [IDL.Opt(Metadata)], ['query']),
  });
  return Main;
};
export const init = ({ IDL }) => { return []; };

export const idlFactory = ({ IDL }) => {
  const Branch = IDL.Rec();
  const List = IDL.Rec();
  const GPS = IDL.Record({
    'latitude' : IDL.Float64,
    'longitude' : IDL.Float64,
  });
  const Time = IDL.Int;
  const Hash = IDL.Nat32;
  const Key = IDL.Record({ 'key' : IDL.Text, 'hash' : Hash });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Null), List)));
  const AssocList = IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Null), List));
  const Leaf = IDL.Record({ 'size' : IDL.Nat, 'keyvals' : AssocList });
  const Trie = IDL.Variant({
    'branch' : Branch,
    'leaf' : Leaf,
    'empty' : IDL.Null,
  });
  Branch.fill(IDL.Record({ 'left' : Trie, 'size' : IDL.Nat, 'right' : Trie }));
  const Set = IDL.Variant({
    'branch' : Branch,
    'leaf' : Leaf,
    'empty' : IDL.Null,
  });
  const Metadata = IDL.Record({
    'gps' : GPS,
    'time' : Time,
    'likersPrincipalID' : Set,
    'principalID' : IDL.Text,
  });
  const Artist = IDL.Record({
    'photoKeys' : Set,
    'alias' : IDL.Text,
    'walletAddr' : IDL.Text,
  });
  const Main = IDL.Service({
    'addArtist' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    'addLike' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'addMetadata' : IDL.Func([IDL.Text, IDL.Text, GPS, Time], [IDL.Bool], []),
    'getAllMetadataByArtist' : IDL.Func([IDL.Text], [IDL.Vec(Metadata)], []),
    'getArtist' : IDL.Func([IDL.Text], [IDL.Opt(Artist)], ['query']),
    'getMetadata' : IDL.Func([IDL.Text], [IDL.Opt(Metadata)], ['query']),
  });
  return Main;
};
export const init = ({ IDL }) => { return []; };

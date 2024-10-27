import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Artist {
  'photoKeys' : Array<string>,
  'alias' : string,
  'walletAddr' : string,
}
export interface GPS { 'latitude' : number, 'longitude' : number }
export interface Main {
  'addArtist' : ActorMethod<[string, string, string], boolean>,
  'addLike' : ActorMethod<[string, string], undefined>,
  'addMetadata' : ActorMethod<[string, string, GPS, Time], boolean>,
  'getAllMetadata' : ActorMethod<[[] | [Time], [] | [Time]], Array<Metadata>>,
  'getAllMetadataByArtist' : ActorMethod<[string], Array<Metadata>>,
  'getArtist' : ActorMethod<[string], [] | [Artist]>,
  'getMetadata' : ActorMethod<[string], [] | [Metadata]>,
  'removeLike' : ActorMethod<[string, string], undefined>,
}
export interface Metadata {
  'gps' : GPS,
  'alias' : string,
  'time' : Time,
  'walletAddr' : string,
  'photoKey' : string,
  'likersPrincipalID' : Array<string>,
  'principalID' : string,
}
export type Time = bigint;
export interface _SERVICE extends Main {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

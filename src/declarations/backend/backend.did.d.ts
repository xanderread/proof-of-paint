import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ArtistDetails { 'alias' : string, 'walletAddress' : string }
export interface GPS { 'latitude' : number, 'longitude' : number }
export interface Main {
  'addMetadata' : ActorMethod<
    [string, ArtistDetails, GPS, Time, string],
    undefined
  >,
  'getMetadata' : ActorMethod<[string], [] | [PhotoUploadMetadata]>,
  'greet' : ActorMethod<[string], string>,
  'listAllMetadata' : ActorMethod<[], Array<PhotoUploadMetadata>>,
  'whoAmI' : ActorMethod<[], Principal>,
}
export interface PhotoUploadMetadata {
  'id' : string,
  'gps' : GPS,
  'date' : Time,
  'assetLink' : string,
  'artist' : ArtistDetails,
}
export type Time = bigint;
export interface _SERVICE extends Main {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

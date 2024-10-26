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
  'addVote' : ActorMethod<[string, string, boolean], undefined>,
  'getAllStortedVotes' : ActorMethod<[string], [bigint, bigint]>,
  'getMetadata' : ActorMethod<[string], [] | [PhotoUploadMetadata]>,
}
export interface PhotoUploadMetadata {
  'gps' : GPS,
  'date' : Time,
  'artist' : ArtistDetails,
}
export type Time = bigint;
export interface _SERVICE extends Main {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

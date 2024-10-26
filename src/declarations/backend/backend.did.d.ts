import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Artist {
  'photoKeys' : Set,
  'alias' : string,
  'walletAddr' : string,
}
export type AssocList = [] | [[[Key, null], List]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
export interface GPS { 'latitude' : number, 'longitude' : number }
export type Hash = number;
export interface Key { 'key' : string, 'hash' : Hash }
export interface Leaf { 'size' : bigint, 'keyvals' : AssocList }
export type List = [] | [[[Key, null], List]];
export interface Main {
  'addArtist' : ActorMethod<[string, string, string], boolean>,
  'addLike' : ActorMethod<[string, string], boolean>,
  'addMetadata' : ActorMethod<[string, string, GPS, Time], boolean>,
  'getAllMetadataByArtist' : ActorMethod<[string], Array<Metadata>>,
  'getArtist' : ActorMethod<[string], [] | [Artist]>,
  'getMetadata' : ActorMethod<[string], [] | [Metadata]>,
}
export interface Metadata {
  'gps' : GPS,
  'time' : Time,
  'likersPrincipalID' : Set,
  'principalID' : string,
}
export type Set = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export type Time = bigint;
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export interface _SERVICE extends Main {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

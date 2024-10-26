import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Int "mo:base/Int";

actor class Main() {

	var initialSize = 1000;
	var metadataStorage = HashMap.HashMap<Text, PhotoUploadMetadata>(initialSize, Text.equal, Text.hash);
	var voteStorage = HashMap.HashMap<Text, VoteUpload>(initialSize, Text.equal, Text.hash);
	
	stable var metadataEntries : [(Text, PhotoUploadMetadata)] = [];
	stable var voteEntries : [(Text, VoteUpload)] = [];

	// single vote for both Up/Like and down/dislike
	type VoteUpload = {
		photoKey: Text;
		isUp: Bool;
	};

	type GPS = {
		latitude : Float;
		longitude : Float;
	};

	type ArtistDetails = {
		alias : Text;
		walletAddress : Text;
	};

	// Metadata to go alongside a streetart photo
	type PhotoUploadMetadata = {
		artist: ArtistDetails;
		gps : GPS;
		date : Time.Time;
		photoKey: Text;
	};

	// stable variable to keep track of the insertion order
	stable var metadataInsertionOrder : [Text] = [];

	system func preupgrade() {
		metadataEntries := Iter.toArray(metadataStorage.entries());
		voteEntries := Iter.toArray(voteStorage.entries());
	};

	system func postupgrade() {
		metadataStorage := HashMap.fromIter<Text, PhotoUploadMetadata>(metadataEntries.vals(), initialSize, Text.equal, Text.hash);
		voteStorage := HashMap.fromIter<Text, VoteUpload>(voteEntries.vals(), initialSize, Text.equal, Text.hash);
		metadataEntries := [];
		voteEntries := [];
	};

	public func addMetadata(photoKey : Text, artist : ArtistDetails, gps : GPS, date : Time.Time) : async () {
		let metadata = {
			artist;
			gps;
			date;
			photoKey;
		};
		metadataStorage.put(photoKey, metadata);
		metadataInsertionOrder := Array.append(metadataInsertionOrder, [photoKey]);
	};

	// Modify the existing function to optionally limit the number of entries
	public query func getAllPhotoMetaData(limit : ?Nat) : async [PhotoUploadMetadata] {
		let allMetadata = Iter.toArray(metadataStorage.vals());
		switch (limit) {
			case (null) { allMetadata };
			case (?n) {
				let start = Int.abs(Int.max(0, allMetadata.size() - n));
				Array.subArray(allMetadata, start, n);
			};
		};
	};

	// Add a new function to get the last X entries
	public query func getRecentPhotoMetadata(count : Nat) : async [PhotoUploadMetadata] {
		let start = Int.abs(Int.max(0, metadataInsertionOrder.size() - count));
		let recentKeys = Array.subArray(metadataInsertionOrder, start, count);
		Array.mapFilter(recentKeys, func (key : Text) : ?PhotoUploadMetadata {
			metadataStorage.get(key)
		});
	};

	// Retrieve metadata by photo ID
	public query func getMetadata(photoKey : Text) : async ?PhotoUploadMetadata {
		metadataStorage.get(photoKey)
	};

	// key will need to be generated in FE, looks hard to do in Mokoto
	public func addVote(voteKey: Text, photoKey: Text, isUp: Bool) : async () {
		let vote = {photoKey; isUp};
		voteStorage.put(voteKey, vote);
	};

	// Gets all votes by photoKey, sorted into (NumUpvotes, NumDownvotes)
	public query func getAllStortedVotes(photoKey: Text) : async (Nat, Nat) {
		let votes = Iter.toArray(Iter.filter(voteStorage.vals(), func (vote: VoteUpload) : Bool {
        	vote.photoKey == photoKey
    	}));

		var upvotes = 0;
		var downvotes = 0;
		
		for (vote in votes.vals()) {
			if (vote.isUp) {
				upvotes += 1;
			} else {
				downvotes += 1;
			};
		};
		
		(upvotes, downvotes)
	};
};

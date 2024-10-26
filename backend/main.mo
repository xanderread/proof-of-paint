import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Bool "mo:base/Bool";

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
	};

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

	// Add metadata for a new photo
	// Can just use same key for both photo and metadata
	public func addMetadata(photoKey : Text, artist : ArtistDetails, gps : GPS, date : Time.Time, assetLink : Text) : async () {
		let metadata = {photoKey; artist; gps; date; assetLink };
		metadataStorage.put(photoKey, metadata);
	};

	public func getAllPhotoKeys(): async[Text] {
		Iter.toArray(metadataStorage.keys())
	};

	// Retrieve metadata by photo ID
	public query func getMetadata(photoKey : Text) : async ?PhotoUploadMetadata {
		metadataStorage.get(photoKey)
	};

	// key will need to be generated in FE, looks hard to do in Mokoto
	public query func addVote(voteKey: Text, photoKey: Text, isUp: Bool) : async () {
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

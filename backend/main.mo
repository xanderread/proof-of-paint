import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Bool "mo:base/Bool";

actor class Main(initArgs : { phrase : Text }) {
	public query func greet(name : Text) : async Text {
		return initArgs.phrase # ", " # name # "!";
	};

	// public query ({ caller }) func whoAmI() : async Principal {
	// 	return caller;
	// };

	// use single vote for both Up and down
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
		// photoKey : Text;
		artist: ArtistDetails;
		gps : GPS;
		date : Time.Time;
		// assetLink : Text; 
	};

	stable var metadataEntries : [(Text, PhotoUploadMetadata)] = [];

	var initialSize = 1000;
	var metadataStorage = HashMap.HashMap<Text, PhotoUploadMetadata>(initialSize, Text.equal, Text.hash);
	var voteStorage = HashMap.HashMap<Text, VoteUpload>(initialSize, Text.equal, Text.hash);

	system func preupgrade() {
		metadataEntries := Iter.toArray(metadataStorage.entries());
	};

	system func postupgrade() {
		metadataStorage := HashMap.fromIter<Text, PhotoUploadMetadata>(metadataEntries.vals(), 10, Text.equal, Text.hash);
		metadataEntries := [];
	};

	// Add metadata for a new photo
	// can just use same key for both photo and metadata
	public func addMetadata(photoKey : Text, artist : ArtistDetails, gps : GPS, date : Time.Time, assetLink : Text) : async () {
		let metadata = {artist; gps; date; assetLink };
		metadataStorage.put(photoKey, metadata);
	};

	// Retrieve metadata by photo ID
	public query func getMetadata(photoKey : Text) : async ?PhotoUploadMetadata {
		metadataStorage.get(photoKey)
	};

	// Retrieve all metadata entries
	// public query func listAllMetadata() : async [PhotoUploadMetadata] {
	// 	Iter.toArray(metadataStorage.vals())
	// };

	public query func addVote(voteKey: Text, photoKey: Text, isUp: Bool) : async () {
		let vote = {photoKey; isUp};
		voteStorage.put(voteKey, vote);
	};

	public query func getAllStortedVotes(photoKey: Text) : async (Nat, Nat) {
		let votes = Iter.toArray(voteStorage.vals());
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

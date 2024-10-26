import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";

actor class Main(initArgs : { phrase : Text }) {
	public query func greet(name : Text) : async Text {
		return initArgs.phrase # ", " # name # "!";
	};

	public query ({ caller }) func whoAmI() : async Principal {
		return caller;
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
		id : Text;
		artist: ArtistDetails;
		gps : GPS;
		date : Time.Time;
		assetLink : Text;
	};

	stable var metadataEntries : [(Text, PhotoUploadMetadata)] = [];

	var initialSize = 1000;
	var metadataStorage = HashMap.HashMap<Text, PhotoUploadMetadata>(initialSize, Text.equal, Text.hash);

	system func preupgrade() {
		metadataEntries := Iter.toArray(metadataStorage.entries());
	};

	system func postupgrade() {
		metadataStorage := HashMap.fromIter<Text, PhotoUploadMetadata>(metadataEntries.vals(), 10, Text.equal, Text.hash);
		metadataEntries := [];
	};

	// Add metadata for a new photo
	public func addMetadata(id : Text, artist : ArtistDetails, gps : GPS, date : Time.Time, assetLink : Text) : async () {
		let metadata = { id; artist; gps; date; assetLink };
		metadataStorage.put(id, metadata);
	};

	// Retrieve metadata by photo ID
	public query func getMetadata(id : Text) : async ?PhotoUploadMetadata {
		metadataStorage.get(id)
	};

	// Retrieve all metadata entries
	public query func listAllMetadata() : async [PhotoUploadMetadata] {
		Iter.toArray(metadataStorage.vals())
	};
};

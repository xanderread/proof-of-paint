import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
// import Time "mo:base/Time";

actor class Main(initArgs : { phrase : Text }) {
	public query func greet(name : Text) : async Text {
		return initArgs.phrase # ", " # name # "!";
	};

	public query ({ caller }) func whoAmI() : async Principal {
		return caller;
	};

  // Define a record type to store metadata for each streetart photo
//   type PhotoMetadata = {
//     id: Text;
//     name: Text;
//     gpsCoordinates: Text;
//     uploadDate: Time;
//   };

//   stable var metadataEntries : [(Text, PhotoMetadata)] = [];
//   var metadataStorage = HashMap.HashMap<Text, PhotoMetadata>(10, Text.equal, Text.hash);

//   system func preupgrade() {
//     metadataEntries := Iter.toArray(metadataStorage.entries());
//   };

//   system func postupgrade() {
//     metadataStorage := HashMap.fromIter<Text, PhotoMetadata>(metadataEntries.vals(), 10, Text.equal, Text.hash);
//     metadataEntries := [];
//   };

//   // Add metadata for a new photo
//   public func addMetadata(id: Text, name: Text, gpsCoordinates: Text, uploadDate: Time) : async () {
//     let metadata = { id = id; name = name; gpsCoordinates = gpsCoordinates; uploadDate = uploadDate };
//     metadataStorage.put(id, metadata);
//   };

//   // Retrieve metadata by photo ID
//   public func getMetadata(id: Text) : async ?PhotoMetadata {
//     metadataStorage.get(id);
//   };

//   // Retrieve all metadata entries
//   public func listAllMetadata() : async [PhotoMetadata] {
//     metadataStorage.values();
//   };

};

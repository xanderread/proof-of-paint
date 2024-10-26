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
    
    stable var metadataEntries : [(Text, PhotoUploadMetadata)] = [];

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
		likes: Nat;
    };

    // stable variable to keep track of the insertion order
    stable var metadataInsertionOrder : [Text] = [];

    system func preupgrade() {
        metadataEntries := Iter.toArray(metadataStorage.entries());
    };

    system func postupgrade() {
        metadataStorage := HashMap.fromIter<Text, PhotoUploadMetadata>(metadataEntries.vals(), initialSize, Text.equal, Text.hash);
        metadataEntries := [];
    };

    public func addMetadata(photoKey : Text, artist : ArtistDetails, gps : GPS, date : Time.Time) : async Bool {
        switch (metadataStorage.get(photoKey)) {
            case (null) {
                // Image doesn't exist, add it
                let metadata = {
                    artist;
                    gps;
                    date;
                    photoKey;
                    likes = 0;
                };
                metadataStorage.put(photoKey, metadata);
                metadataInsertionOrder := Array.append(metadataInsertionOrder, [photoKey]);
                true // Return true to indicate successful addition
            };
            case (_imageExists) {
                false 
            };
        };
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

    public query func getPhotoMetadata(lastN : Nat) : async [PhotoUploadMetadata] {
        let start = Int.abs(Int.max(0, metadataInsertionOrder.size() - lastN));
        let recentKeys = Array.subArray(metadataInsertionOrder, start, lastN);
        Array.mapFilter(recentKeys, func (key : Text) : ?PhotoUploadMetadata {
            metadataStorage.get(key)
        });
    };

    // key will need to be generated in FE, looks hard to do in Mokoto
	public func like(photoKey: Text) : async () {
		switch (metadataStorage.get(photoKey)) {
			case (null) { /* Do nothing if photo doesn't exist */ };
			case (?metadata) {
				let updatedMetadata = {
					metadata with
					likes = metadata.likes + 1
				};
				metadataStorage.put(photoKey, updatedMetadata);
			};
		};
	};


};

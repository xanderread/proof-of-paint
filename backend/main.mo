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
    var artistStorage = HashMap.HashMap<Text, Artist>(initialSize, Text.equal, Text.hash);

    stable var metadataEntries : [(Text, PhotoUploadMetadata)] = [];
    stable var artistEntries: [(Text, Artist)] = [];

    type GPS = {
        latitude : Float;
        longitude : Float;
    };

    // alias will be hashed key
    type Artist = {
        // alias : Text;
        walletAddress : Text;
        photos: [Text]; // list of metadata/photo keys
    };

    // Metadata to go alongside a streetart photo
    type PhotoUploadMetadata = {
        artistAlias: Text;
        gps : GPS;
        time : Time.Time;
        photoKey: Text;
        likes: Nat;
    };

    // stable variable to keep track of the insertion order
    stable var metadataInsertionOrder : [Text] = [];

    system func preupgrade() {
        metadataEntries := Iter.toArray(metadataStorage.entries());
        artistEntries := Iter.toArray(artistStorage.entries());
    };

    system func postupgrade() {
        metadataStorage := HashMap.fromIter<Text, PhotoUploadMetadata>(metadataEntries.vals(), initialSize, Text.equal, Text.hash);
        metadataEntries := [];
        artistStorage := HashMap.fromIter<Text, Artist>(artistEntries.vals(), initialSize, Text.equal, Text.hash);
        artistEntries := [];
    };

    // doesn't need to public as will be called when photo metadata added
    func addArtist(artistAlias: Text, walletAddress : Text) : async () {

        switch (artistStorage.get(artistAlias)) {
            case (null) {
                // artist doesn't exist, hence can add it
                let artist = {
                    walletAddress;
                    photos = [];
                };
                artistStorage.put(artistAlias, artist);
            };

            case (_artistExists) {}
        }
    };

    func artistAddPhoto(photoKey: Text, artistAlias: Text) : async () {

            switch (artistStorage.get(artistAlias)) {
            case (?artist) {
                let updatedArtist = {
                    artist with
                    photos = Array.append(artist.photos, [photoKey]);
                };
                artistStorage.put(artistAlias, updatedArtist);
            };
            case null {};
        };        
    };

    public func addMetadata(photoKey : Text, artistAlias: Text, walletAddress : Text, gps : GPS, date : Time.Time) : async Bool {
        
        // will add artist if doesn't currently exist
        await addArtist(artistAlias, walletAddress);
        
        switch (metadataStorage.get(photoKey)) {
            case (null) {
                // Image doesn't exist, add it
                let metadata = {
                    artistAlias;
                    gps;
                    time=date;
                    photoKey;
                    likes = 0;
                };
                metadataStorage.put(photoKey, metadata);
                metadataInsertionOrder := Array.append(metadataInsertionOrder, [photoKey]);

                // append photo key to artist photos list
                await artistAddPhoto(artistAlias, photoKey);
            
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
    public func likePhoto(photoKey: Text) : async () {
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


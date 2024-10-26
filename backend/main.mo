import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Int "mo:base/Int";

actor class Main() {

    var initialSize = 1000;

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

    // Metadata 
    var metadataStorage = HashMap.HashMap<Text, PhotoUploadMetadata>(initialSize, Text.equal, Text.hash);
    stable var metadataEntries : [(Text, PhotoUploadMetadata)] = [];
    
    // Stable variable to keep track of the insertion order
    stable var metadataInsertionOrder : [Text] = [];

    // Types for Metadata
    type PhotoUploadMetadata = {
        artistAlias: Text;
        gps : GPS;
        time : Time.Time;
        photoKey: Text;
        likes: Nat;
    };
    type GPS = {
        latitude : Float;
        longitude : Float;
    };

    // Metadata functions
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

    // Optional limit
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

    public func dislikePhoto(photoKey: Text) : async () {
        switch (metadataStorage.get(photoKey)) {
            case (null) { /* Do nothing if photo doesn't exist */ };
            case (?metadata) {                
                if (metadata.likes > 0) {
                    let updatedMetadata = {
                        metadata with
                        likes = metadata.likes + 1
                    };
                    metadataStorage.put(photoKey, updatedMetadata);
                };                
            };
        };
    };

    // Artist
    var artistStorage = HashMap.HashMap<Text, Artist>(initialSize, Text.equal, Text.hash);
    stable var artistEntries: [(Text, Artist)] = [];
    
    // Type
    type Artist = {
        walletAddress : Text;
        photos: [Text]; // list of metadata/photo keys
    };
    // Only use inside addMetadata(..)
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

    // Add link between artist and photo, required when adding photo
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

    public query func searchByArtist(artistAlias: Text): async[Text] {
        switch (artistStorage.get(artistAlias)) {
            case (?artist) {
                artist.photos
            };
            case null {[]};
        };
    };
};
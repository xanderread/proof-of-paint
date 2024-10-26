import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import TrieSet "mo:base/TrieSet";

actor class Main() {

    var initialSize = 1000;

    // Metadata storage indexed by photoKey
    var metadataStorage = HashMap.HashMap<Text, Metadata>(initialSize, Text.equal, Text.hash);

    // Artist storage indexed by princiapID
    var artistStorage = HashMap.HashMap<Text, Artist>(initialSize, Text.equal, Text.hash);

    // Linked to Artist via principalID
    type Metadata = {
        principalID: Text;
        gps: GPS;
        time: Time.Time;
        likersPrincipalID: TrieSet.Set<Text>;
    };
    type GPS = {
        latitude : Float;
        longitude : Float;
    };
    // linked to photos via photoKeys
    type Artist = {
        alias: Text;
        walletAddr: Text;
        photoKeys: TrieSet.Set<Text>;
    };

    public func addMetadata(principalID: Text, photoKey: Text, gps: GPS, time: Time.Time): async Bool {
        switch (artistStorage.get(principalID)) {
            case (?artist) {
                switch (metadataStorage.get(photoKey)) {
                    case (null) {
                        // Image doesn't exist, we can add it
                        let metadata = {
                            principalID;
                            gps;
                            time;
                            photoKey;
                            likersPrincipalID = TrieSet.empty<Text>();
                        };
                        metadataStorage.put(photoKey, metadata);
                        
                        // TODO: add photoKey into artist.photoKeys and update artist in storage                        
                        
                        true
                    };
                    case (_imageExists) {
                        false 
                    };
                };
            };
            case null {false};
        };  
    };

    public query func getMetadata(photoKey: Text): async ?Metadata {
        metadataStorage.get(photoKey)
    };

    // TODO: getAllMetadata (optionalTimeframe)

    public func getAllMetadataByArtist(principalID: Text): async [Metadata] {
        switch (artistStorage.get(principalID)) {
            case (?artist) {
                let photoKeyArray = TrieSet.toArray(artist.photoKeys);
                var metadataArr: [Metadata] = [];

                // Iterate over each photoKey and collect metadata
                for (photoKey in photoKeyArray.vals()) {
                    switch (metadataStorage.get(photoKey)) {
                        case (?metadata) {
                            metadataArr := Array.append(metadataArr, [metadata]);
                        };
                        case (null) {};
                    };
                };

                metadataArr
            };
            case null {[]};
        };
    };

    public func addArtist(principalID: Text, alias: Text, walletAddr: Text): async Bool {
        switch (artistStorage.get(principalID)) {
            case (?_artist) {
                false
            };
            case null {
                let artist = {
                    alias;
                    walletAddr;
                    photoKeys = TrieSet.empty<Text>();
                };
                artistStorage.put(principalID, artist);
                true
            };
        };
    };

    public query func getArtist(principalID: Text): async ?Artist {
        artistStorage.get(principalID)
    };

    // addLike(principalID, photoKey)
    public func addLike(principalID: Text, photoKey: Text): async Bool {
        switch (getArtist(principalID)) {
            case (artist) {



                false
            };
            // case null {false};
        };
    }
    

    // system func preupgrade() {
    //     metadataEntries := Iter.toArray(metadataStorage.entries());
    //     artistEntries := Iter.toArray(artistStorage.entries());
    // };

    // system func postupgrade() {
    //     metadataStorage := HashMap.fromIter<Text, PhotoUploadMetadata>(metadataEntries.vals(), initialSize, Text.equal, Text.hash);
    //     metadataEntries := [];
    //     artistStorage := HashMap.fromIter<Text, Artist>(artistEntries.vals(), initialSize, Text.equal, Text.hash);
    //     artistEntries := [];
    // };

    // // Metadata 
    // var metadataStorage = HashMap.HashMap<Text, PhotoUploadMetadata>(initialSize, Text.equal, Text.hash);
    // stable var metadataEntries : [(Text, PhotoUploadMetadata)] = [];
    
    // // Stable variable to keep track of the insertion order
    // stable var metadataInsertionOrder : [Text] = [];

    // // Types for Metadata
    // type PhotoUploadMetadata = {
    //     principalId: Text;
    //     gps : GPS;
    //     time : Time.Time;
    //     photoKey: Text;
    //     likes: Nat;
    // };
    // type GPS = {
    //     latitude : Float;
    //     longitude : Float;
    // };

    // // Metadata functions
    // public func addMetadata(principalId: Text, photoKey : Text, gps : GPS, date : Time.Time) : async Bool {
    
    //     switch (artistStorage.get(principalId)) {
    //         case (?_artist) {
    //             switch (metadataStorage.get(photoKey)) {
    //             case (null) {
    //                 // Image doesn't exist, add it
    //                 let metadata = {
    //                     principalId;
    //                     gps;
    //                     time=date;
    //                     photoKey;
    //                     likes = 0;
    //                 };
    //                 metadataStorage.put(photoKey, metadata);
    //                 metadataInsertionOrder := Array.append(metadataInsertionOrder, [photoKey]);
    //                 // append photo key to artist photos list
    //                 await artistAddPhoto(principalId, photoKey);
    //                 true // Return true to indicate successful addition
    //             };
    //         case (_imageExists) {
    //             false 
    //         };
    //     };
    //         };
    //         case null {false};
    //     };  
    // };

    // // Optional limit
    // public query func getAllPhotoMetaData(limit : ?Nat) : async [PhotoUploadMetadata] {
    //     let allMetadata = Iter.toArray(metadataStorage.vals());
    //     switch (limit) {
    //         case (null) { allMetadata };
    //         case (?n) {
    //             let start = Int.abs(Int.max(0, allMetadata.size() - n));
    //             Array.subArray(allMetadata, start, n);
    //         };
    //     };
    // };

    // public func likePhoto(photoKey: Text) : async () {
    //     switch (metadataStorage.get(photoKey)) {
    //         case (null) { /* Do nothing if photo doesn't exist */ };
    //         case (?metadata) {
    //             let updatedMetadata = {
    //                 metadata with
    //                 likes = metadata.likes + 1
    //             };
    //             metadataStorage.put(photoKey, updatedMetadata);
    //         };
    //     };
    // };

    // public func dislikePhoto(photoKey: Text) : async () {
    //     switch (metadataStorage.get(photoKey)) {
    //         case (null) { /* Do nothing if photo doesn't exist */ };
    //         case (?metadata) {                
    //             if (metadata.likes > 0) {
    //                 let updatedMetadata = {
    //                     metadata with
    //                     likes = metadata.likes + 1
    //                 };
    //                 metadataStorage.put(photoKey, updatedMetadata);
    //             };                
    //         };
    //     };
    // };

    // // Artist
    // var artistStorage = HashMap.HashMap<Text, Artist>(initialSize, Text.equal, Text.hash);
    // stable var artistEntries: [(Text, Artist)] = [];
    
    // // Type
    // type Artist = {
    //     artistAlias: Text;
    //     walletAddress : Text;
    //     photos: [Text]; // list of metadata/photo keys
    // };

    // public func addArtist(principalId: Text, artistAlias: Text, walletAddress : Text) : async Bool {
    //     switch (artistStorage.get(artistAlias)) {
    //         case (null) {
    //             // artist doesn't exist, hence can add it
    //             let artist = {
    //                 artistAlias;
    //                 walletAddress;
    //                 photos = [];
    //             };
    //             artistStorage.put(principalId, artist);
    //             true
    //         };
    //         case (_artistExists) {false}
    //     }
    // };

    // // Add link between artist and photo, required when adding photo
    // func artistAddPhoto(principalId: Text, photoKey: Text) : async () {
    //     switch (artistStorage.get(principalId)) {
    //         case (?artist) {
    //             let updatedArtist = {
    //                 artist with
    //                 photos = Array.append(artist.photos, [photoKey]);
    //             };
    //             artistStorage.put(principalId, updatedArtist);
    //         };
    //         case null {};
    //     };        
    // };

    // public query func searchByArtist(artistAlias: Text): async[Text] {
    //     switch (artistStorage.get(artistAlias)) {
    //         case (?artist) {
    //             artist.photos
    //         };
    //         case null {[]};
    //     };
    // };
};
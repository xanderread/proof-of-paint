import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import TrieSet "mo:base/TrieSet";
import Iter "mo:base/Iter";

actor class Main() {

    var initialSize = 1000;

    // Metadata storage indexed by photoKey
    var metadataStorage = HashMap.HashMap<Text, Metadata>(initialSize, Text.equal, Text.hash);
    stable var metadataEntries : [(Text, Metadata)] = [];

    // Artist storage indexed by princiapID
    var artistStorage = HashMap.HashMap<Text, Artist>(initialSize, Text.equal, Text.hash);
    stable var artistEntries : [(Text, Artist)] = [];

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
                        // Add photoKey into artist.photoKeys and update artist in storage
                        
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

    public func addLike(principalID: Text, photoKey: Text): async Bool {
        switch (artistStorage.get(principalID)) {
            case (artist) {

                // TODO: Check artist hasn't already liked photo
                // if they havent't, add them to TrieSet, update artist in storage and return true
                // else return false

                true
            };
            case null {false};
        };
    };
    

    system func preupgrade() {
        metadataEntries := Iter.toArray(metadataStorage.entries());
        artistEntries := Iter.toArray(artistStorage.entries());
    };

    system func postupgrade() {
        metadataStorage := HashMap.fromIter<Text, Metadata>(metadataEntries.vals(), initialSize, Text.equal, Text.hash);
        metadataEntries := [];
        artistStorage := HashMap.fromIter<Text, Artist>(artistEntries.vals(), initialSize, Text.equal, Text.hash);
        artistEntries := [];
    };
};
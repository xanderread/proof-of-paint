import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
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
        photoKey: Text;
        principalID: Text;
        gps: GPS;
        time: Time.Time;
        likersPrincipalID: [Text];
    };
    type GPS = {
        latitude : Float;
        longitude : Float;
    };
    // linked to photos via photoKeys
    type Artist = {
        alias: Text;
        walletAddr: Text;
        photoKeys: [Text];
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
                            likersPrincipalID = [];
                        };
                        metadataStorage.put(photoKey, metadata);
                        
                        let updatedArtist = {
                            alias = artist.alias;
                            walletAddr = artist.walletAddr;
                            photoKeys = Array.append(artist.photoKeys, [photoKey]);
                        };
                        artistStorage.put(principalID, updatedArtist);
                        
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

    public query func getAllMetadata(optionalStartTime: ?Time.Time, optionalEndTime: ?Time.Time): async [Metadata] {
        var metadataArr: [Metadata] = [];
        for ((_, metadata) in metadataStorage.entries()) {
            let startTimeCheck = switch optionalStartTime {
                case (?startTime) metadata.time >= startTime;
                case null true;
            };
            let endTimeCheck = switch optionalEndTime {
                case (?endTime) metadata.time <= endTime;
                case null true;
            };
            if (startTimeCheck and endTimeCheck) {
                metadataArr := Array.append(metadataArr, [metadata]);
            };
        };
        metadataArr
    };

    public func getAllMetadataByArtist(principalID: Text): async [Metadata] {
        switch (artistStorage.get(principalID)) {
            case (?artist) {
                var metadataArr: [Metadata] = [];

                // Iterate over each photoKey and collect metadata
                for (photoKey in artist.photoKeys.vals()) {
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
                    photoKeys = [];
                };
                artistStorage.put(principalID, artist);
                true
            };
        };
    };

    public query func getArtist(principalID: Text): async ?Artist {
        artistStorage.get(principalID)
    };

    public func addLike(principalID: Text, photoKey: Text): async() {
        switch (artistStorage.get(principalID)) {
            case (?_artist) {
                switch(metadataStorage.get(photoKey)){
                    case(?metadata) {        
                        for (likerPrincipalID in metadata.likersPrincipalID.vals()){
                            if (likerPrincipalID == principalID)
                            {return;}
                        };                  
                        let updatedMetadata = {
                            photoKey = metadata.photoKey;
                            principalID = metadata.principalID;
                            gps = metadata.gps;
                            time = metadata.time;
                            likersPrincipalID = Array.append(metadata.likersPrincipalID, [principalID]);
                        };
                        metadataStorage.put(photoKey, updatedMetadata);
                    };
                    case null{};
                };
            };
            case null {};
        };
    };

    public func removeLike(principalID: Text, photoKey: Text): async() {
        switch (artistStorage.get(principalID)) {
            case (?_artist) {
                switch(metadataStorage.get(photoKey)){
                    case(?metadata) {        
                        var newLikersPrincialID: [Text] = [];
                        for (likerPrincipalID in metadata.likersPrincipalID.vals()){
                            if (likerPrincipalID != principalID){

                                newLikersPrincialID := Array.append(newLikersPrincialID, [likerPrincipalID]);
                            }
                        };                  
                        let updatedMetadata = {
                            photoKey = metadata.photoKey;
                            principalID = metadata.principalID;
                            gps = metadata.gps;
                            time = metadata.time;
                            likersPrincipalID = newLikersPrincialID;
                        };
                        metadataStorage.put(photoKey, updatedMetadata);
                    };
                    case null{};
                };
            };
            case null {};
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
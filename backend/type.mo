import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Int "mo:base/Int";

module {
    public type GPS = {
        latitude : Float;
        longitude : Float;
    };

    public type ArtistDetails = {
        alias : Text;
        walletAddress : Text;
    };

    // Metadata to go alongside a streetart photo
    public type PhotoUploadMetadata = {
        artist: ArtistDetails;
        gps : GPS;
        time : Time.Time;
        photoKey: Text;
        likes: Nat;
    };
}

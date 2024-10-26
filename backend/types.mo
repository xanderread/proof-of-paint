module {
    public type GPS = {
        latitude : Float;
        longitude : Float;
    };

    public type ArtistDetails = {
        alias : Text;
        walletAddress : Text;
    };

    public type PhotoUploadMetadata = {
        id : Text;
        artist : ArtistDetails;
        gps : GPS;
        date : Int;
        assetLink : Text;
    };
}

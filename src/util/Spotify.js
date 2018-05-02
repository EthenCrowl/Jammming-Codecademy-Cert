let accessToken;
let expirationTime;
const clientId = 'f21e4a2bc70e4924b6cd2b1e3d8b7c29';
const redirectURI = 'http://localhost:3000/';
let accessTokenString;
let Spotify = {

    getAccessToken: function() {
        if (accessToken !== undefined) {
            accessTokenString = accessToken[1]
            return accessToken;
        } else if (new RegExp('access_token').test(window.location.href)) {
            accessToken = window.location.href.match(/access_token=([^&]*)/);
            accessTokenString = accessToken[1];
            expirationTime = window.location.href.match(/expires_in=([^&]*)/);
            window.setTimeout(() => accessToken = '', expirationTime * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectURI;
        }
    },

    search: function(term) {
        this.getAccessToken();
        let authorization = 'Bearer ' + accessTokenString;
        return fetch('https://api.spotify.com/v1/search?type=track&q=' + term, {
            headers: {
                'Authorization': authorization
            }
        }).then(response => response.json()).then(response => {
            if (response) {
                try {
                    let items = response.tracks.items
                    let data = items.map(track => {
                        let item = {
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri
                        };
                        return item;
                    })
                    return data;
                } catch(error) {
                    console.log(error);
                }
            };
        });
    },

    savePlaylist: function(playlistName, URIs) {
        if (playlistName !== null && URIs !== null && playlistName !== '') {
            let authorization = 'Bearer ' + accessTokenString;
            console.log(authorization);
            let uid;
            fetch('https://api.spotify.com/v1/me', {
                method:'GET',
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => response.json(), networkError => console.log(networkError)).then(response => {
                uid = response.id;
                let playlistID;
                return fetch('https://api.spotify.com/v1/users/' + uid + '/playlists', {
                    method: 'POST',
                    headers: {
                        'Authorization': authorization,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: playlistName
                    })
                }).then(response => response.json(), networkError => console.log(networkError)).then(response => {
                    playlistID = response.id;
                    return fetch('https://api.spotify.com/v1/users/' + uid + '/playlists/' + playlistID + '/tracks', {
                        method: 'POST',
                        headers: {
                            'Authorization': authorization,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            uris: URIs
                        })
                    });
                });
            });
        } else {
            return;
        }
    }
};

export default Spotify;
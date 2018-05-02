import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: 'Playlist Name'
    }

    this.state.searchResults = [];
    this.state.playlistTracks = [];

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.includes(track)) {
      return;
    } else {
      let newTrackList = this.state.playlistTracks;
      newTrackList.push(track);
      this.setState({playlistTracks: newTrackList});
    }
  }

  removeTrack(track) {
    const currentTracks = this.state.playlistTracks;
    const index = currentTracks.indexOf(track);
    currentTracks.splice(index, 1);
    this.setState({playlistTracks: currentTracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let tracks = this.state.playlistTracks;
    let trackURIs = tracks.map(track => {
        return track.uri;
    })
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  search(term) {
    let tempResults = Spotify.search(term)
    tempResults.then(results => {
      this.setState({ searchResults: results });
    });
  }



  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist 
              name={this.state.playlistName} 
              tracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist}
              />
          </div>
        </div>
      </div>
    );
  }


}

export default App;

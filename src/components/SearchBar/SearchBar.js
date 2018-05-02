import React from 'react';
import './SearchBar.css';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: 'default value'
    };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search() {
    let inputValue = this.state.inputText;
    this.props.onSearch(inputValue);
  }

  handleTermChange() {
    let inputValue = document.getElementById('searchBarInput').value;
    this.setState({
      inputText: inputValue
    });
  }

  render() {
    return (
      <div className="SearchBar">
        <input 
          placeholder="Enter A Song, Album, or Artist" 
          type="text"
          id='searchBarInput'
          onChange={this.handleTermChange}
        />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}
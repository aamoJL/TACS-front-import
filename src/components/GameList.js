import React, { Fragment } from 'react';

class GameList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      games: [],
      selectedGame: null
    }
  }

  componentDidMount() {
    fetch('http://localhost:5000/game/listgames')
    .then(response => response.json())
    .then(games => this.setState({games}))
    .catch(error => {console.log(error);})
  }

  handleChange = (e) =>{
    this.setState({
      selectedGame: e.target.value
    });
  }

  handleEditClick = (e) => {
    if(this.state.selectedGame === null){alert('No game selected');}
    else{
      fetch('http://localhost:5000/game/' + this.state.selectedGame)
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.log(error))
    }
  }

  render() {
    let items = [];

    for (let i = 0; i < this.state.games.length; i++) {
      const element = this.state.games[i];
      items.push(
        <option key={element.id} value={element.id}>{element.name}</option>
      );
    }

    return (
      <Fragment>
        <label>Game: </label>
        <select onChange={this.handleChange}>
          {items}
        </select> 
        <button onClick={this.handleEditClick}>Edit game</button>
      </Fragment>
    );
  }
}
 
export default GameList;
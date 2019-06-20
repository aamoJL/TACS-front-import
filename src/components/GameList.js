import React, { Fragment } from 'react';

class GameList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      games: []
    }
  }

  componentDidMount() {
    fetch('http://localhost:5000/game/listgames')
    .then(response => response.json())
    .then(games => this.setState({games}))
    .catch(error => {console.log(error);})
  }

  handleChange = (e) =>{
    console.log(e.target.value);
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
      </Fragment>
    );
  }
}
 
export default GameList;
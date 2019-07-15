import React from "react";

export default class JoinGameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameJSON: undefined
    };
  }

  componentDidMount() {
    if (this.props.gameId === undefined) {
      alert("game not selected");
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/game/${this.props.gameId}`)
        .then(result => result.json())
        .then(json => {
          this.setState({
            gameJSON: json
          });
        })
        .catch(error => console.log(error));
    }
  }

  render() {
    if (this.state.gameJSON === undefined) {
      return false;
    }

    return (
      <div>
        <form>
          <label>Join game: {this.state.gameJSON.name}</label>
          <div>{this.state.gameJSON.desc}</div>
          <button onClick={() => console.log("clicked")}>Submit</button>
        </form>
      </div>
    );
  }
}

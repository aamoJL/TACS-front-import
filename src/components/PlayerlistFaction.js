import React from "react";

export default class PlayerlistFaction extends React.Component {
  state = {
    factionMembers: null
  };

  // get faction members
  componentDidMount() {
    fetch(
      `${process.env.REACT_APP_API_URL}/faction/get-faction-members/${
        this.props.faction.factionId
      }`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ factionMembers: res });
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.factionMembers === null) {
      return false;
    }

    let members = this.state.factionMembers.map(member => {
      return (
        <div key={member.gamepersonId}>
          {member.person.name} : {member.role}
        </div>
      );
    });

    return (
      <div>
        <br />
        <div>{this.props.faction.factionName}</div>
        <br />
        <div>{members}</div>
      </div>
    );
  }
}

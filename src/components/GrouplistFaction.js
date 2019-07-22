import React from "react";
import GrouplistGroupCard from "./GroupCard";

export default class GrouplistFaction extends React.Component {
  state = {
    faction: null,
    factionGroups: null
  };
  // get faction groups
  componentDidMount() {
    this.getFactionGroups();
  }

  getFactionGroups() {
    fetch(
      `${process.env.REACT_APP_API_URL}/faction/get-groups/${
        this.props.faction.factionId
      }`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ factionGroups: res });
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.factionGroups === null) {
      return false;
    }

    // map faction groups
    let groups = this.state.factionGroups.map(group => {
      console.log(group);
      return (
        <div>{group.name}</div>
        // <GrouplistGroupCard
        //   key={group.Id}
        //   group={group.name}
        //   //onChange={() => this.getFactionGroups()}
        // />
      );
    });

    return (
      <div>
        <br />
        <div>{this.props.faction.factionName}</div>
        <br />
        <div>{groups}</div>
      </div>
    );
  }
}

import React from "react";
import GrouplistGroupCard from "./GroupCard";

export default class GrouplistView extends React.Component {
  state = {
    factionGroups: null
  };

  // get faction members
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

    let groups = this.state.factionGroups.map(group => {
      return (
        <GrouplistGroupCard
          key={group.groupId}
          group={group}
          gameId={this.props.gameId}
          onChange={() => this.getFactionGroups()}
        />
      );
    });

    return (
      //   <div>
      //     <br />
      //     <div>{this.props.faction.factionName}</div>
      //     <br />
      //     <div>{groups}</div>
      //   </div>
      <div>hello</div>
    );
  }
}

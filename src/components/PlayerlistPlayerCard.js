import React, { Fragment } from "react";

export default class PlayerlistPlayerCard extends React.Component {
  state = {
    edit: false
  };

  render() {
    console.log(this.props.player);
    return (
      <div>
        {this.props.player.person.name} :{" "}
        {this.state.edit && (
          <select>
            <option value="soldier">Soldier</option>
            <option value="factionleader">Faction Leader</option>
            <option value="admin">Admin</option>
          </select>
        )}
        {!this.state.edit && this.props.player.role}
        {this.props.role === "admin" && !this.state.edit && (
          <button onClick={() => this.setState({ edit: !this.state.edit })}>
            Edit
          </button>
        )}
        {this.state.edit && (
          <Fragment>
            <button>Save</button>
            <button>Cancel</button>
          </Fragment>
        )}
      </div>
    );
  }
}

import React, { Fragment } from "react";

export default class PlayerlistPlayerCard extends React.Component {
  state = {
    edit: false,
    roleInput: this.props.player.role
  };

  handleSave = () => {
    let token = sessionStorage.getItem("token");

    if (this.state.roleInput === "") {
      return alert("Error: Selected role is not valid");
    }

    if (
      window.confirm(
        `Change ${this.props.player.name}'s role to "${this.state.roleInput}"?`
      )
    ) {
      fetch(
        `${process.env.REACT_APP_API_URL}/faction/promote/${this.props.gameId}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            role: this.state.roleInput,
            player: this.props.player.gamepersonId
          })
        }
      )
        .then(res => {
          return res.json();
        })
        .then(res => {
          this.props.onChange();
          alert(
            `Player ${this.props.player.name}'s role was changed to "${
              res.role
            }"`
          );
          this.setState({ edit: false });
        })
        .catch(error => console.log(error));
    } else {
      this.setState({ edit: false, roleInput: this.props.player.role });
    }
  };

  render() {
    // Normal user view
    if (this.props.role !== "admin") {
      return (
        <div>
          {this.props.player.name} : {this.props.player.role}
        </div>
      );
    }

    // Admin edit view
    else if (this.state.edit) {
      return (
        <div>
          {this.props.player.name} :{" "}
          <select
            id={"playerCardRoleSelect" + this.props.player.name}
            value={this.state.roleInput}
            onChange={e => this.setState({ roleInput: e.target.value })}
          >
            {roleOptions()}
          </select>
          <button
            id={"playerCardSaveButton" + this.props.player.name}
            onClick={this.handleSave}
          >
            Save
          </button>
          <button
            id={"playerCardCancelButton" + this.props.player.name}
            onClick={() => {
              this.setState({ edit: false, roleInput: this.props.player.role });
            }}
          >
            Cancel
          </button>
        </div>
      );
    } else {
      // Admin view without editing
      return (
        <div>
          {this.props.player.name} : {this.props.player.role}
          {this.props.gameState === "CREATED" && (
            <button
              id={"playerCardEditButton" + this.props.player.name}
              onClick={() => this.setState({ edit: !this.state.edit })}
            >
              Edit
            </button>
          )}
        </div>
      );
    }
  }
}

// Available options for user roles
function roleOptions() {
  return (
    <Fragment>
      <option value="soldier">Soldier</option>
      <option value="factionleader">Faction Leader</option>
      <option value="admin">Admin</option>
    </Fragment>
  );
}

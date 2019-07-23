import React from "react";

class TaskItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      selectedFactionId: "",
      factions: []
    };
  }

  componentDidMount() {
    this.getFactionlist(this.props.gameId);
  }

  getFactionlist(gameId) {
    fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`, {
      method: "GET"
    })
      .then(result => {
        if (!result.ok) {
          throw Error(result.responseText);
        } else {
          return result.json();
        }
      })
      .then(result => {
        this.setState({
          factions: result.factions,
          selectedFactionId: result.factions[0].factionId
        });
      })
      .catch(error => console.log(error));
  }

  onSaveSubmit = e => {
    e.preventDefault();
    this.props.onSave(this.props.task, this.state.selectedFactionId);
    this.setState({
      edit: false
    });
  };

  handleFactionChange = e => {
    this.setState({
      selectedFactionId: e.target.value
    });
  };

  onTaskDelete = e => {
    e.preventDefault();

    if (
      window.confirm(
        `Are you sure you want to delete task "${this.props.task.taskName}"`
      )
    ) {
      this.props.onDelete(this.props.task.taskId);
      this.setState({
        edit: false
      });
    }
  };

  render() {
    let factionlistItems = this.state.factions.map(faction => (
      <option key={faction.factionId} value={faction.factionId}>
        {faction.factionName}
      </option>
    ));

    return (
      <div className="tasklist-item">
        <div>
          <label>{this.props.task.taskName}</label>
        </div>
        <div>
          <label>{this.props.task.taskDescription}</label>
          <br />
          <label>
            Faction:{" "}
            {this.props.task.faction !== null
              ? this.props.task.faction.factionName
              : "Every faction"}
          </label>
          <br />
          {this.props.task.taskWinner !== null && (
            <label>Winner: {this.props.task.taskWinner.factionName}</label>
          )}
        </div>
        {this.props.task.taskIsActive && this.props.role === "admin" && (
          <button
            id={"taskEditButton" + this.props.task.taskName}
            onClick={() => this.setState({ edit: !this.state.edit })}
          >
            {this.state.edit ? "Cancel" : "Set Winner"}
          </button>
        )}
        {this.state.edit && (
          <form onSubmit={this.onSaveSubmit}>
            <select
              id={"taskWinnerSelect" + this.props.task.taskName}
              value={this.state.selectedFactionId}
              onChange={e =>
                this.setState({ selectedFactionId: e.target.value })
              }
            >
              {factionlistItems}
            </select>
            <button
              id={`taskSaveButton${this.props.task.taskName}`}
              type="submit"
            >
              Save
            </button>
          </form>
        )}
        {this.props.role === "admin" && (
          <button
            id={"taskDeleteButton" + this.props.task.taskName}
            onClick={this.onTaskDelete}
            style={{ backgroundColor: "red" }}
          >
            Delete
          </button>
        )}
      </div>
    );
  }
}

export default TaskItem;

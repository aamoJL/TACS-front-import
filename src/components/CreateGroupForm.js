import React from "react";

class CreateGroupForm extends React.Component {
  state = {
    groupName: "",
    groupClass: "infantry"
  };

  handleGroupSave = _ => {
    fetch(
      `${process.env.REACT_APP_API_URL}/faction/create-group/${
        this.props.gameId
      }`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.groupName,
          class: this.state.groupClass,
          faction: this.props.factionId
        })
      }
    )
      .then(res => res.json())
      .then(res => {
        if (!res.code) {
          this.props.onGroupCreated();
          alert("created group");
        } else {
          throw Error(res.message);
        }
      })
      .catch(error => alert(error));
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div>
        <h2>Create a new group:</h2>
        <input
          placeholder="New Group Name"
          name="groupName"
          value={this.state.groupName}
          onChange={this.handleChange}
          id="newGroupInput"
          required
        />
        <h3>Group class</h3>
        <select
          value={this.state.groupClass}
          onChange={e => this.setState({ groupClass: e.target.value })}
        >
          <option value="infantry">Infantry</option>
          <option value="recon">Recon</option>
          <option value="mechanized">Mechanized</option>
        </select>
        <button onClick={this.handleGroupSave}>Create</button>
      </div>
    );
  }
}

export default CreateGroupForm;

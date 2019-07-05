import React from 'react';

class TaskItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      edit: false,
      selectedFaction: "",
      factions: []
    }
  }

  componentDidMount(){
    this.getFactionlist(this.props.gameId);
  }

  onEditClick = e => {
    this.setState({
      edit: !this.state.edit
    });
  }

  getFactionlist(gameId){
    fetch(`${process.env.REACT_APP_URL}/game/${gameId}`, {
      method: 'GET'
    })
    .then(result => result.json())
    .then(result => {
      if(result.code !== undefined){
        console.log(result);
      }
      else{
        this.setState({
          factions: result.factions,
          selectedFaction: result.factions[0]
        });
      }
    })
    .catch(error => console.log(error));
  }

  onSaveSubmit = e => {
    e.preventDefault();
    this.props.onSave(this.props.task, this.state.selectedFaction);
    this.setState({
      edit: false
    })
  }

  handleFactionChange = e => {
    this.setState({
      selectedFaction: e.target.value
    });
  }

  render(){
    return(
      <div className='tasklist-item'>
        <div>
          <label>{this.props.task.taskName}</label>
        </div>
        <div>
          <label>{this.props.task.taskDescription}</label><br />
          <label>Faction: {this.props.task.faction !== null ? this.props.task.faction.factionName : "Every faction"}</label>
        </div>
        {this.props.task.taskIsActive &&
          <button onClick={this.onEditClick}>Edit</button>
        }
        {this.state.edit && 
          <form onSubmit={this.onSaveSubmit}>
            <select value={this.state.selectedFaction} onChange={(e) => this.setState({selectedFaction: e.target.value})}>
              {this.state.factions.map((item) => <option key={item.factionId} value={item.factionId}>{item.factionName}</option> )}
            </select>
            <button type="submit">Save</button>
          </form>
        }
      </div>
    );
  }
}

export default TaskItem;
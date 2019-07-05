import ReactDOM from 'react-dom';
import React from 'react';
import TaskItem from './TaskItem';

class TaskList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      taskNameInput: "", // >= 3
      taskDescriptionInput: "", // no limits
      tasks: [],
      factionlist: [],
      selectedFactionId: "",
      gameId: "178cd342-9637-4481-ab81-d89585e9e006"  // TODO: add this with props
    }
  }

  componentDidMount(){
    this.getTasks(this.state.gameId);
    this.getFactionlist(this.state.gameId) // TODO: remove if the user is not admin?
  }

  getTasks(gameId){
    let token = sessionStorage.getItem("token");
    fetch(`${process.env.REACT_APP_URL}/task/get-tasks/${gameId}`, {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(result => result.json())
    .then(result => {
      if(result.code !== undefined){
        console.log(result);
      }
      else{
        this.setState({
          tasks: result
        })
      }
    })
    .catch(error => console.log(error));
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
          factionlist: result.factions
        });
      }
    })
    .catch(error => console.log(error));
  }

  handleTaskCreation = (e) => {
    e.preventDefault();
    if(this.state.taskNameInput === ""){
      return alert("Task needs a name");
    }

    let token = sessionStorage.getItem("token");
    fetch(`${process.env.REACT_APP_URL}/task/new-task/${this.state.gameId}`,{
      method: "POST",
      headers:{
        Authorization: "Bearer " + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        taskName: this.state.taskNameInput,
        taskDescription: this.state.taskDescriptionInput,
        taskIsActive: true,
        faction: this.state.selectedFactionId === "" ? null : this.state.selectedFactionId,
        taskWinner: null,
        taskGame: this.state.gameId
      })
    })
    .then(result => result.json())
    .then(result => {
      if(result.code){
        console.log(result.message);
        alert(result.message);
      }
      else{
        // Success
        alert(result.message);
        this.setState({
          taskDescriptionInput: "",
          taskNameInput: ""
        })
        this.getTasks(this.state.gameId);
      }
    })
    .catch(error => console.log(error));
  }

  handleFactionChange = e => {
    this.setState({
      selectedFactionId: e.target.value
    });
  }

  onTaskSave = (task, winnerFaction) => {
    let token = sessionStorage.getItem("token");
    fetch(`${process.env.REACT_APP_URL}/task/edit-task/${this.state.gameId}`, {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + token,
        'Content-Type':"application/json"
      },
      body:JSON.stringify({
        taskId: task.taskId,
        taskWinner: winnerFaction.factionId,
        taskGame: this.state.gameId
      })
    })
    .then(result => result.json())
    .then(result => {
      if(result.code !== 201){
        alert(result.message);
      }
      else{
        alert(result.message);
        this.getTasks(this.state.gameId);
      }
    })
    .catch(error => console.log(error));
  }
  
  render(){
    let tasklistItems = [];
    for (let i = 0; i < this.state.tasks.length; i++) {
      const task = this.state.tasks[i];
      tasklistItems.push(
        <TaskItem key={task.taskId} task={task} gameId={this.state.gameId} onSave={this.onTaskSave}/>
      );
    }

    let factionlistItems = this.state.factionlist.map(item => {
      return <option key={item.factionId} value={item.factionId}>{item.factionName}</option>
    })

    // add all factions option to the faction list
    factionlistItems.unshift(
      <option key="all" value="">Every faction</option>
    )

    return ReactDOM.createPortal(
      <div className='tasklist'>
        <h1>Tasklist</h1>
        <form className='task-form' onSubmit={this.handleTaskCreation}>
          <label>New task</label>
          <input id="taskNameInput" type='text' placeholder='Task name' minLength="3" value={this.state.taskNameInput} onChange={(e) => this.setState({taskNameInput: e.target.value})}></input>
          <textarea id="taskDescriptionInput" placeholder='Task description' value={this.state.taskDescriptionInput} onChange={(e) => this.setState({taskDescriptionInput: e.target.value})}></textarea>
          <select id="taskFactionSelect" onChange={this.handleFactionChange}>
            {factionlistItems}
          </select>
          <button id="newTaskSubmitButton" type="submit">Add new task</button>
        </form>
        {tasklistItems}
      </div>,
      document.getElementById('tasklist')
    );
  }
}

export default TaskList;
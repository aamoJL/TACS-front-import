import ReactDOM from 'react-dom';
import React from 'react';
import TaskItem from './TaskItem';

class TaskList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      taskNameInput: "", // >= 3
      taskDescriptionInput: "", // no limits
      tasks: []
    }
  }

  componentDidMount(){
    this.getTasks("178cd342-9637-4481-ab81-d89585e9e006");
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

  handleTaskCreation = (e) => {
    e.preventDefault();
    if(this.state.taskNameInput === ""){
      return alert("Task needs a name");
    }

    let token = sessionStorage.getItem("token");
    fetch(`${process.env.REACT_APP_URL}/task/new-task/${"178cd342-9637-4481-ab81-d89585e9e006"}`,{
      method: "POST",
      headers:{
        Authorization: "Bearer " + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        taskName: this.state.taskNameInput,
        taskDescription: this.state.taskDescriptionInput,
        taskIsActive: true,
        faction: "ad5195d6-820c-4a17-8549-65ac0945fd3e",
        taskWinner: null,
        taskGame: "178cd342-9637-4481-ab81-d89585e9e006"
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
        this.getTasks("178cd342-9637-4481-ab81-d89585e9e006");
      }
    })
    .catch(error => console.log(error));
  }
  
  render(){
    let tasks = [];
    for (let i = 0; i < this.state.tasks.length; i++) {
      const task = this.state.tasks[i];
      tasks.push(
        <TaskItem key={task.taskId} text={task.taskName} description={task.taskDescription}/>
      );
    }

    return ReactDOM.createPortal(
      <div className='tasklist'>
        <h1>Tasklist</h1>
        <form className='task-form' onSubmit={this.handleTaskCreation}>
          <label>New task</label>
          <input type='text' placeholder='Task name' minLength="3" value={this.state.taskNameInput} onChange={(e) => this.setState({taskNameInput: e.target.value})}></input>
          <textarea placeholder='Task description' value={this.state.taskDescriptionInput} onChange={(e) => this.setState({taskDescriptionInput: e.target.value})}></textarea>
          <button type="submit">Add new task</button>
        </form>
        {tasks}
      </div>,
      document.getElementById('tasklist')
    );
  }
}

export default TaskList;
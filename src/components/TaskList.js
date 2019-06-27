import ReactDOM from 'react-dom';
import React from 'react';
import TaskItem from './TaskItem';

class TaskList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      taskName: "",
      taskDescription: "",
      tasks: [{
        name: "asd",
        description: "qweqweqwsd a dasdsa dsada asda sdas  cverfer "
      }]
    }
  }

  handleTaskCreation = (e) => {
    if(this.state.taskName !== ""){
      console.log(`"${this.state.taskName}" task created :)`);
      this.setState((state) => {
        var tasks = state.tasks;
        tasks.push({name: state.taskName, description: state.taskDescription});
        var object = {
          taskName: "",
          taskDescription: "",
          tasks: tasks
        }
        return object;
      });
    }
    else{
      console.log("Task needs a name!");
    }
  }
  
  render(){
    let token = sessionStorage.getItem('token');

    let tasks = [];
    for (let i = 0; i < this.state.tasks.length; i++) {
      const task = this.state.tasks[i];
      tasks.unshift(
        <TaskItem key={i} text={task.name} description={task.description}/>
      );
    }

    return ReactDOM.createPortal(
      <div className='tasklist'>
        <h1>Tasklist</h1>
        {token && 
          <div className='task-form'>
          <input type='text' placeholder='Task name' value={this.state.taskName} onChange={(e) => this.setState({taskName: e.target.value})}></input>
          <textarea placeholder='Task description' value={this.state.taskDescription} onChange={(e) => this.setState({taskDescription: e.target.value})}></textarea>
          <button onClick={this.handleTaskCreation}>Add new task</button>
          </div>
        }
        {tasks}
      </div>,
      document.getElementById('tasklist')
    );
  }
}

export default TaskList;
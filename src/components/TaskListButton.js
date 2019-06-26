import React, { Fragment } from 'react';
import TaskList from './TaskList';

class TaskListButton extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      open: false,
      newTasks: '0'
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (e) => {
    this.setState({
      open: !this.state.open
    },() =>{
      // Set new task cout to zero when the tasklist opens
      if(this.state.open){
          this.setState({newTasks: '0'})
      }
    });
  }

  render(){
    return(
      <Fragment>
        <button onClick={this.handleClick}>Tasks ({this.state.newTasks})</button>
        {this.state.open && <TaskList />}
      </Fragment>
    );
  }
}

export default TaskListButton;
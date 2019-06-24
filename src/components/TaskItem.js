import React from 'react';

class TaskItem extends React.Component{
  render(){
    return(
      <div className='tasklist-item'>
        <div>
          <label>{this.props.text}</label>
        </div>
        <div>
          <label>{this.props.description}</label>
        </div>
      </div>
    );
  }
}

export default TaskItem;
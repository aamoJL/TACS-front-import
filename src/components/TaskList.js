import ReactDOM from 'react-dom';
import React from 'react';
import TaskItem from './TaskItem';

class TaskList extends React.Component{
  render(){
    let token = sessionStorage.getItem('token');

    return ReactDOM.createPortal(
      <div className='tasklist'>
        {token && 
          <div className='task-form'>
          <input type='text' placeholder='Task name'></input>
          <textarea placeholder='Task description'></textarea>
          <button>Add new task</button>
          </div>
        }
        <TaskItem text='asd' description='asudhaiud'/>
        <TaskItem text='asd2' description='q7213761923769821'/>
        <TaskItem text='asd3' description='tehtävä3'/>
      </div>,
      document.getElementById('tasklist')
    );
  }
}

export default TaskList;
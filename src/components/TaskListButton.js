import React, { Fragment } from 'react';
import TaskList from './TaskList';

class TaskListButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        this.setState({
            open: !this.state.open
        });
    }

    render(){
        return(
            <Fragment>
                <button onClick={this.handleClick}>Tasks</button>
                {this.state.open && <TaskList />}
            </Fragment>
        );
    }
}

export default TaskListButton;
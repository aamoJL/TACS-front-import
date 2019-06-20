import React from 'react';

class TaskItem extends React.Component{
    render(){
        return(
            <p>
                <label>Name: {this.props.text}</label>
                <br />
                <label>Description: {this.props.description}</label>
            </p>
        );
    }
}

export default TaskItem;
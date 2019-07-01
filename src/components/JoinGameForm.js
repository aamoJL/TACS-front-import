import React from "react";
import ReactDOM from "react-dom"

export default class JoinGameForm extends React.Component{
  render(){
    if(this.props.game === null){return false;}

    return ReactDOM.createPortal(
      <div className="fade-main">
        <label>{this.props.game.name}</label>
        <div>{this.props.game.desc}</div>
      </div>,
      document.getElementById('form')
    );
  }
}
import React from "react";
import { Link } from "react-router-dom";

export class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: "",
      username: "",
      password: ""
    };
  }

  handleError = error => {
    this.setState({ errorMsg: error });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleLogin = e => {
    const name = this.state.username;
    const password = this.state.password;
    e.preventDefault();

    // Send login info to the server
    fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        password: password
      })
    })
      .then(res => res.json())
      .then(
        result => {
          if (result.name) {
            this.props.handleState(result);
          } else {
            this.handleError(result.message);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error);
        }
      );
  };

  render() {
    return (
      <div className="fade-main">
        <div className="login">
          <form onSubmit={this.handleLogin}>
            <h1>Login</h1>
            <br />
            <input
              placeholder="Enter Username"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              id="loginUsernameInput"
              autoFocus
            />
            <br />
            <input
              placeholder="Enter password"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              id="loginPasswordInput"
            />
            <br />
            <button id="submitLoginButton" type="submit">
              Submit
            </button>
            <h2>{this.state.errorMsg}</h2>
          </form>
          <Link to="/register">
            <button id="loginRegisterButton">Create account</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default LoginForm;

import React from "react";
import { Link } from "react-router-dom";
import logo from "../icons/tacs-logo-neg.png";

/*
Component for login page
*/

export class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: "",
      username: "",
      password: ""
    };
  }

  // Sets error message state
  handleError = error => {
    this.setState({ errorMsg: error });
  };

  // Changes state value
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Sends login request to the server
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

  // TODO: UNCOMMENT "REQUIRED" FOR PRODUCTION
  // RF TESTS ALSO VERIFY BACKEND ERROR HANDLING
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="d-flex flexbox-container flex-fill justify-content-center text-center">
            <img className="tacs-logo-neg" src={logo} alt="tacs logo" />
          </div>
        </div>
        <div className="row">
          <div className="d-flex flexbox-container flex-fill justify-content-center text-center">
            <div className="tacs-login">
              <form onSubmit={this.handleLogin}>
                <p className="login-text">Login</p>
                <br />
                <input
                  className="form-control1"
                  placeholder="Enter username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  id="loginUsernameInput"
                  autoFocus
                  //required
                />
                <br />
                <input
                  className="form-control2"
                  placeholder="Enter password"
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  id="loginPasswordInput"
                  //required
                />
                <br />
                <br />

                <button
                  className="btn btn-secondary"
                  id="submitLoginButton"
                  type="submit"
                >
                  Login
                </button>
                {this.state.errorMsg && (
                  <div
                    id="loginErrorMessage"
                    className="d-flex flex-fill justify-content-center text-center"
                  >
                    {this.state.errorMsg}
                  </div>
                )}
              </form>
              <br />
              Need an account?
              <Link to="/register">
                <p id="openRegisterFormButton"> Register</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className=" justify-content-center text-center footer text-muted">
            &copy; 2019 TACS
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;

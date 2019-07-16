import React from "react";

import logo from "../icons/placeholderlogo.PNG";

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

  // show/hide this form
  handleView = e => {
    this.props.toggleView(this.props.view);
  };

  // toggles the login/register view
  toggleView = view => {
    this.setState({
      form: view
    });
  };

  // remove login view with ESC
  handleEsc = e => {
    if (e.keyCode === 27) {
      this.handleView();
    }
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
            this.handleView();
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

  componentDidMount() {
    document.addEventListener("keyup", this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEsc);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="d-flex flexbox-container flex-fill justify-content-center text-center">
            <img className="img" src={logo} />
          </div>
        </div>
        <div className="row">
          <div className="d-flex flexbox-container flex-fill justify-content-center text-center">
            <div className="login">
              <form onSubmit={this.handleLogin}>
                <h1>Login</h1>
                <input
                  className="form-control"
                  placeholder="Enter Username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  id="loginUsernameInput"
                  autoFocus
                  required
                />
                <input
                  className="form-control"
                  placeholder="Enter password"
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  id="loginPasswordInput"
                  required
                />

                <button
                  type="button"
                  className="btn btn-secondary"
                  id="submitLoginButton"
                  type="submit"
                >
                  Login
                </button>
                {this.state.errorMsg && (
                  <div className="d-flex flex-fill justify-content-center text-center">
                    {this.state.errorMsg}
                  </div>
                )}
              </form>
              {!this.state.username && (
                <div
                  id="registerButton"
                  onClick={() => this.toggleView("register")}
                >
                  Don't have account yet? Register!
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="d-flex flexbox-container flex-fill justify-content-center text-center">
            &copy; 2019 TACS
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;

import React from "react";

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
      <div style={{ "max-height": "100%" }}>
        <div className="container-fluid form-group shadow-lg bg-primary h-100">
          <div className="row">
            <div className="col-sm">
              <div className="sticky">
                <h1>LOGO</h1>
                <span
                  id="closeLoginFormX"
                  className="close"
                  onClick={this.handleView}
                >
                  ×
                </span>
              </div>
            </div>
            <div className="col-sm">
              <div className="login">
                <form onSubmit={this.handleLogin}>
                  <h1>demo login</h1>
                  <br />
                  <input
                    className="form-control"
                    placeholder="Enter Username"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                    id="loginUsernameInput"
                    autoFocus
                  />
                  <br />
                  <input
                    className="form-control"
                    placeholder="Enter password"
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    id="loginPasswordInput"
                  />
                  <br />
                  <button
                    type="button"
                    className={`btn btn-primary`}
                    id="submitLoginButton"
                    type="submit"
                  >
                    login
                  </button>
                  <h2>{this.state.errorMsg}</h2>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;

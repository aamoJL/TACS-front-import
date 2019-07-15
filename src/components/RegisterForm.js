import React from "react";
import logo from "../icons/placeholderlogo.PNG";

export class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: "",
      username: "",
      password: "",
      password2: ""
    };
  }

  // shows error messages associated with registering
  handleError = error => {
    this.setState({ errorMsg: error });
  };

  // updates state with input values
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // show/hide this form
  handleView = e => {
    this.props.toggleView(this.props.view);
  };

  // remove register view with ESC
  handleEsc = e => {
    if (e.keyCode === 27) {
      this.handleView();
    }
  };

  handleRegister = e => {
    const name = this.state.username;
    const password = this.state.password;
    e.preventDefault();

    if (this.state.password !== this.state.password2) {
      this.handleError("Passwords do not match");
    } else {
      // Send register info to the server
      fetch(`${process.env.REACT_APP_API_URL}/user/register`, {
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
    }
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEsc);
  }
  // UNCOMMENT "REQUIRED" FOR PRODUCTION
  render() {
    return (
      <div className="row content">
        <div className="d-flex flexbox-container flex-fill justify-content-around border-right">
          <img className="img" src={logo} />
        </div>
        <div className="d-flex flexbox-container flex-fill justify-content-center text-center">
          <div className="login">
            <form onSubmit={this.handleRegister}>
              <h1>Register</h1>

              <input
                className="form-control"
                placeholder="Enter Username"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
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
                required
              />
              <input
                className="form-control"
                placeholder="Verify password"
                type="password"
                name="password2"
                value={this.state.password2}
                onChange={this.handleChange}
                required
              />

              <button
                type="button"
                className="btn btn-secondary"
                id="submitRegisterButton"
                type="submit"
              >
                Register
              </button>
              {this.state.errorMsg && (
                <div className="d-flex flex-fill justify-content-center text-center">
                  {this.state.errorMsg}
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="row copyright">
          <div className="d-flex flex-fill justify-content-center text-center">
            <div>&copy; 2019 TACS</div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;

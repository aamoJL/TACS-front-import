import React from "react";
import logo from "../icons/tacs-logo-neg.png";
import { Link } from "react-router-dom";

/*
Component for register form page
*/

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

  // Sends register request to the server
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

  // TODO: UNCOMMENT "REQUIRED" FOR PRODUCTION
  // RF TESTS ALSO VERIFY BACKEND ERROR HANDLING
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="d-flex flexbox-container flex-fill justify-content-around">
            <img className="tacs-logo-neg" src={logo} alt="TACS Logo" />
          </div>
        </div>
        <div className="row">
          <div className="d-flex flexbox-container flex-fill justify-content-center text-center">
            <div className="tacs-register">
              <form onSubmit={this.handleRegister}>
                <p className="register-text">Register</p>
                <br />
                <input
                  id="registerUsernameInput"
                  className="form-control1"
                  placeholder="Enter username"
                  name="username"
                  id="registerUsernameInput"
                  value={this.state.username}
                  onChange={this.handleChange}
                  autoFocus
                  //required
                />
                <br />
                <input
                  id="registerPasswordInput"
                  className="form-control2"
                  placeholder="Enter password"
                  type="password"
                  name="password"
                  id="registerPasswordInput"
                  value={this.state.password}
                  onChange={this.handleChange}
                  //required
                />
                <br />
                <input
                  id="registerPasswordVerifyInput"
                  className="form-control3"
                  placeholder="Verify password"
                  type="password"
                  name="password2"
                  id="registerPasswordVerifyInput"
                  value={this.state.password2}
                  onChange={this.handleChange}
                  //required
                />
                <br />

                <button
                  className="btn btn-secondary"
                  id="submitRegisterButton"
                  type="submit"
                >
                  Register
                </button>
                {this.state.errorMsg && (
                  <div
                    id="registerErrorMessage"
                    className="d-flex flex-fill justify-content-center text-center"
                  >
                    {this.state.errorMsg}
                  </div>
                )}
              </form>
              <br />
              Back to
              <Link to="/">
                <p id="openLoginFormButton"> Login </p>
              </Link>
            </div>
          </div>
        </div>
        <div className="row copyright">
          <div className="d-flex flex-fill justify-content-center text-center footer text-muted">
            <div>&copy; 2019 TACS</div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;

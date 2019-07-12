import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

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
              this.handleError(result.errorResponse.message);
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

  render() {
    return (
      <div className="fade-main">
        <div className="login">
          <form onSubmit={this.handleRegister}>
            <h1>Register</h1>
            <br />
            <input
              placeholder="Enter Username"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              autoFocus
              //required
            />
            <br />
            <input
              placeholder="Enter password"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              //required
            />
            <br />
            <input
              placeholder="Verify password"
              type="password"
              name="password2"
              value={this.state.password2}
              onChange={this.handleChange}
              //required
            />
            <br />
            <button type="submit">Submit</button>
            <h2>{this.state.errorMsg}</h2>
          </form>
          <Link to="/">
            <button>Login</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default RegisterForm;

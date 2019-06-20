import React from 'react';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import GameList from './GameList';

class Header extends React.Component {
  state = {
    login: false,
    register: false,
    username: null,
    token: null
  };

  // toggles the login/register view
  toggleView = view => {
    this.setState(prevState => {
      return {
        [view]: view === 'login' ? !prevState.login : !prevState.register
      };
    });
  };

  handleState = data => {
    sessionStorage.setItem('name', data.name);
    sessionStorage.setItem('token', data.token);
    this.setState({ username: data.name, token: data.token });
  };

  handleLogout = () => {
    this.setState({ username: null, token: null });
    sessionStorage.removeItem('token');
  };

  // verifies the token (if it exists) on element mount with backend server
  componentDidMount() {
    let token = sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/user/verify', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(res => res.json())
      .then(
        result => {
          // if token is still valid, login user
          if (result === true) {
            this.setState({
              username: sessionStorage.getItem('name'),
              token: token
            });
            // logout user if token has expired / is invalid
          } else {
            this.handleLogout();
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  render() {
    return (
      <div>
        <div className='header'>
          {!this.state.username && (
            <button onClick={() => this.toggleView('register')}>
              register
            </button>
          )}
          {!this.state.username && (
            <button onClick={() => this.toggleView('login')}>login</button>
          )}
          {this.state.username && (
            <button onClick={this.handleLogout}>logout</button>
          )}
          {this.state.username && <button>{this.state.username}</button>}
          <button onClick={this.props.handleLayerChange}>change layer</button>
          <GameList />
        </div>
        {this.state.register && (
          <RegisterForm
            view='register'
            handleState={this.handleState}
            toggleView={this.toggleView}
          />
        )}
        {this.state.login && (
          <LoginForm
            view='login'
            handleState={this.handleState}
            toggleView={this.toggleView}
          />
        )}
      </div>
    );
  }
}

export default Header;

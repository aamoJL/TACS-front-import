import React from 'react';

export class NewGameForm extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      gamename: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      passwords: [],
    }
  }

  handleError = error => {
    this.setState({ errorMsg: error });
  };

  handleChange = e => {
    const { name, value } = e.target;
    console.log(value, name);
    this.setState({ [name]: value });
  };

  // show/hide this form
  handleView = e => {
    this.props.toggleView(this.props.view);
  };

  // remove view with ESC
  handleEsc = e => {
    if (e.keyCode === 27) {
      this.handleView();
    }
  };

  handleGameCreation = e => {
    const name = this.state.username;
    const password = this.state.password;
    e.preventDefault();

    // Send Game info to the server
    fetch('http://localhost:5000/user/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
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
  };

  componentDidMount() {
    document.addEventListener('keyup', this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleEsc);
  }

  render() {
    return (
      <div className='fade-main'>
        <div className='sticky'>
          <span className='close' onClick={this.handleView}>
            ×
          </span>
        </div>
        <div className='login'>
          <form onSubmit={this.handleLogin}>
            <h1>Demo Game Creation</h1>
            <br />
            <input
              placeholder='Game name'
              name='gamename'
              value={this.state.gamename}
              onChange={this.handleChange}
              required
            />
            <br />
            <input
              placeholder='Description'
              type='text'
              name='description'
              value={this.state.description}
              onChange={this.handleChange}
              required
            />
            <br />
            <input
              type='date'
              name='startDate'
              value={this.state.startDate}
              onChange={this.handleChange}
              required
            />
            <br />
            <input
              type='time'
              name='startTime'
              onChange={this.handleChange}
              required
            />
            <br />
            <input
              type='date'
              name='endDate'
              value={this.state.endDate}
              onChange={this.handleChange}
              min={this.state.startDate}
              required
            />
            <br />
            <input
              type='time'
              name='endTime'
              onChange={this.handleChange}
              required
            />
            <br />
            <button type='submit'>Submit</button>
            <h2>{this.state.errorMsg}</h2>
          </form>
        </div>
      </div>
    );
  }
}

export default NewGameForm;
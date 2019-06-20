import React from 'react';
import ReactDOM from 'react-dom';
import {
	Map,
	TileLayer,
  ZoomControl,
  Marker,
  Popup
} from 'react-leaflet'

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
      zoom: 13,
      mapCenter: {
        lat: 62.2416479,
        lng: 25.7597186
      }
    }

    this.handleMapDrag = this.handleMapDrag.bind(this);
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

  // remove view with ESC
  handleEsc = e => {
    if (e.keyCode === 27) {
      this.handleView();
    }
  };

  handleMapDrag = e => {
    this.setState({
      mapCenter: e.target.getCenter()
    });
  }

  handleMapScroll = e => {
    this.setState({
      zoom: e.target.getZoom()
    });
  }

  handleGameCreation = e => {
    let startDate = new Date(this.state.startDate + " " + this.state.startTime);
    let endDate = new Date(this.state.endDate + " " + this.state.endTime);

    const gameObject = {
      name: this.state.gamename,
      desc: this.state.description,
      map: "", //TODO: map json
      startdate: startDate.toISOString(),
      enddate: endDate.toISOString(),
      passwords: [this.state.password],
      center: this.state.mapCenter
    }

    e.preventDefault();

    let token = sessionStorage.getItem('token');

    // Send Game info to the server
    fetch('http://localhost:5000/game/new', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gameObject)
    }).then(res => res.json())
      .then(result => console.log(result))
      .catch(error => console.log('Error: ', error));
  };

  componentDidMount() {
    document.addEventListener('keyup', this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleEsc);
  }

  render() {
    return ReactDOM.createPortal (
      <div className='fade-main'>
        <div className='sticky'>
          <span className='close' onClick={this.handleView}>
            ×
          </span>
        </div>
        <div className=''>
          <form onSubmit={this.handleGameCreation}>
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
            <label className=''>Start:</label>
            <input
              className='formDate'
              type='date'
              name='startDate'
              value={this.state.startDate}
              onChange={this.handleChange}
              required
            />
            <input
              className='formTime'
              type='time'
              name='startTime'
              onChange={this.handleChange}
              required
            />
            <br />
            <label className=''>End:</label>
            <input
              className='formDate'
              type='date'
              name='endDate'
              value={this.state.endDate}
              onChange={this.handleChange}
              min={this.state.startDate}
              required
            />
            <input
              className='formTime'
              type='time'
              name='endTime'
              onChange={this.handleChange}
              required
            />
            <br />
            <label>Map things</label>
            <br />
            <Map className='' center={[this.state.mapCenter.lat, this.state.mapCenter.lng]} zoom={this.state.zoom} style={{height: '400px', width: '400px'} } onmoveend={this.handleMapDrag} onzoomend={this.handleMapScroll}>
              <TileLayer
                attribution='Maanmittauslaitoksen kartta'
                url=' https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg'
              />
            </Map>
            <br />
            <button type='submit'>Submit</button>
            <h2>{this.state.errorMsg}</h2>
          </form>
        </div>
      </div>
      ,document.getElementById('form')
    );
  }
}

export default NewGameForm;
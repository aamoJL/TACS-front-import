import React, { Component } from "react";

export default class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      image: null,
      errorMsg: ""
    };
  }

  // When the user changes the file in the input field
  onChange = e => {
    const file = e.target.files[0];
    // Image validation, maxsize (in bytes), extension
    if (file.size > 1000000) {
      this.setState({ errorMsg: "Image is too large (max 1MB)." });
    } else if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      this.setState({ errorMsg: "Unknown file extension." });
    } else {
      this.setState({ errorMsg: "" });
    }
    this.setState({ uploading: true });
    const formData = new FormData();
    formData.append("image", file);
    // Send the image for the right game
    fetch(`${process.env.REACT_APP_API_URL}/game/upload`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(file => {
        this.setState({
          uploading: false
        });
        // pass the file path to new game form state
        this.props.handleImagePath(file.path);
      });
  };

  render() {
    return (
      <div>
        <label>Upload an image</label>
        <input type="file" id="imageUploadInput" onChange={this.onChange} />
        <div className="errorMessage">{this.state.errorMsg}</div>
      </div>
    );
  }
}

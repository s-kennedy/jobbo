export default class AddPosting extends React.Component {

  constructor(props) {
    super(props);

    this.emptyForm = {
      title: '',
      description: '',
      photo: undefined,
      address: '',
      phone: '',
      email: '',
      source: '',
      lat: undefined,
      lon: undefined
    }
    this.state = this.emptyForm;

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeSource = this.onChangeSource.bind(this);
    this.getAddressFromLocation = this.getAddressFromLocation.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  getLocation(e) {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not available on your device. Please provide the address.")
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 60000
    };
 
    const _geolocationSuccess = (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      this.setState({lat: lat, lon: lon});
    };

    const _geolocationError = (error) => {
      return false
    };

    const result = navigator.geolocation.getCurrentPosition(_geolocationSuccess, _geolocationError, options);
  };


  _geolocationError(error) {
    return false
  };

  getAddressFromLocation(e) {
    const address = e.target.value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address' : address}, (response, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        const lat = response[0].geometry.location.lat();
        const lon = response[0].geometry.location.lng();
        this.setState({lat: lat, lon: lon});
      } else {
        console.log('could not geocode address');
      }
    });
  }

  handleSubmitForm(e) {
    e.preventDefault();
    console.log('submit!')
    const url = '/postings';
    const form = document.querySelector('div.add-posting > form');

    const formData = new FormData();
    const request = new XMLHttpRequest();

    const postingData = {
        title: this.state.title,
        description: this.state.description,
        address: this.state.address,
        phone: this.state.phone,
        email: this.state.email,
        source: this.state.source, 
        latitude: this.state.lat,
        longitude: this.state.lon,
    };
    const photo = document.querySelector('input[name="photo"]').files[0];

    formData.append('posting', JSON.stringify(postingData));
    formData.append('photo', photo);


    request.onload = (res) => {
      this.setState(this.emptyForm);
    };
    request.open("post", url);
    request.send(formData);
  };

  onChangeTitle(e) {
    const value = e.target.value;
    this.setState({title: value});
  };

  onChangeDescription(e) {
    const value = e.target.value;
    this.setState({description: value});
  };

  onChangeAddress(e) {
    const address = e.target.value;
    this.setState({address: address});
  };

  onChangePhone(e) {
    const value = e.target.value;
    this.setState({phone: value});
  };

  onChangeEmail(e) {
    const value = e.target.value;
    this.setState({email: value});
  };

  onChangeSource(e) {
    const value = e.target.value;
    this.setState({source: value});
  };

  render () {
    return(
      <div className="add-posting">
        <form onSubmit={this.handleSubmitForm}>
          <div className="input title">
            Title:
            <input 
              type="text" 
              name="title" 
              onChange={this.onChangeTitle} 
              value={this.state.title}
            />
          </div>

          <div className="input description">
            Description:
            <textarea 
              name="description" 
              onChange={this.onChangeDescription}
              value={this.state.description}
            />
          </div>

          <div className="input photo">
            Photo:
            <input 
              type="file" 
              name="photo"
            />
          </div>

          <div className="input location">
            Address:
            <input 
              type="text" 
              name="address" 
              onChange={this.onChangeAddress}
              onBlur={this.getAddressFromLocation}
              value={this.state.address}
            />
            <button className="get-location" onClick={this.getLocation}>
              Get my location
            </button>
          </div>

          <div className="input phone">
            Phone:
            <input 
              type="text" 
              name="phone" 
              onChange={this.onChangePhone}
              value={this.state.phone}
            />
          </div>

          <div className="input email">
            Email:
            <input 
              type="text" 
              name="email" 
              onChange={this.onChangeEmail}
              value={this.state.email}
            />
          </div>

          <div className="input source">
            Source:
            <input 
              type="text" 
              name="source" 
              onChange={this.onChangeSource}
              value={this.state.source}
            />
          </div>

          <div className="btn-submit">
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  };
}
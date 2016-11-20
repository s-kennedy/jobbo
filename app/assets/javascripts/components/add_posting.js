import TextInputWithLabel from './text_input_with_label.js'
import TextAreaWithLabel from './text_area_with_label.js'
import FileInputWithLabel from './file_input_with_label.js'

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
        <h1>Post a Job</h1>
        <form onSubmit={this.handleSubmitForm}>
          <TextInputWithLabel
            classes='title'
            name='title'
            labelText='Job title'
            onChange={this.onChangeTitle}
            value={this.state.title}
          />

          <TextAreaWithLabel
            classes='description'
            name='description'
            labelText='Description'
            onChange={this.onChangeDescription}
            value={this.state.description}
          />

          <FileInputWithLabel
            classes='photo'
            labelText='Photo'
            name='photo'
          />

          <TextInputWithLabel
            classes='address'
            name='address'
            labelText='Address'
            onChange={this.onChangeAddress}
            value={this.state.address}
            onBlur={this.getAddressFromLocation}
          />
          <a className="get-location" onClick={this.getLocation}>
              Get my location
          </a>

          <TextInputWithLabel
            classes='phone'
            name='phone'
            labelText='Phone number'
            onChange={this.onChangePhone}
            value={this.state.phone}
          />

          <TextInputWithLabel
            classes='email'
            name='email'
            labelText='Email address'
            onChange={this.onChangeEmail}
            value={this.state.email}
          />

          <TextInputWithLabel
            classes='source'
            name='source'
            labelText='How do you know about this job?'
            onChange={this.onChangeSource}
            value={this.state.source}
          />

          <div className='submit-btn'>
            <input className='btn' type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  };
}
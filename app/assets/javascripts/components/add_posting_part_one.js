import TextInputWithLabel from './text_input_with_label.js'
import FileInputWithLabel from './file_input_with_label.js'

export default class AddPostingPartOne extends React.Component {

  constructor(props) {
    super(props);

    this.emptyForm = {
      title: '',
      employer: '',
      photo: undefined,
      address: '',
      lat: undefined,
      lon: undefined,
    }

    this.state = this.emptyForm;

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeEmployer = this.onChangeEmployer.bind(this);
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
        employer: this.state.employer,
        date_to_remove: this.state.date_to_remove,
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


  onChangeAddress(e) {
    const address = e.target.value;
    this.setState({address: address});
  };

  onChangeEmployer(e) {
    const value = e.target.value;
    this.setState({employer: value});
  };

  render () {
    return(
      <section className="add-posting-part-one menu">
        <div className="section-title">
          <h2>Post a Job</h2>
        </div>
        <div className="menu-container">
          <form onSubmit={this.handleSubmitForm}>

            <FileInputWithLabel
              classes='photo'
              labelText='Photo'
              name='photo'
            />

          <h2>About the job</h2>
            <div className="about flex-row"> 
              <TextInputWithLabel
                classes='title'
                name='title'
                labelText='Job title'
                onChange={this.onChangeTitle}
                value={this.state.title}
              />

              <TextInputWithLabel
                classes='employer'
                name='employer'
                labelText='Job employer'
                onChange={this.onChangeEmployer}
                value={this.state.employer}
              />

            </div>

            <h2>Job location</h2>
            <small className="help-text">Provide either the address of the employer or your current location if you're at the job site.</small>
            <div className="location flex-row">
              <TextInputWithLabel
                classes='address'
                name='address'
                labelText='Address'
                onChange={this.onChangeAddress}
                value={this.state.address}
                onBlur={this.getAddressFromLocation}
              />
              <div className="form-field" >
                <a className="get-location" onClick={this.getLocation}>
                  <i className="fa fa-location-arrow" aria-hidden="true"></i>
                  Use my current location
                </a>
              </div>
            </div>

            <div className='submit-btn'>
              <input className='btn' type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </section>
    );
  };
};
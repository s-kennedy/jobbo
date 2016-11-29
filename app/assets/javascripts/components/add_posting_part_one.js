import TextInputWithLabel from './text_input_with_label.js'
import FileInputWithLabel from './file_input_with_label.js'
import CheckboxWithLabel from './checkbox_with_label.js'
import axios from 'axios';

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
    this.onChangeVolunteerCheckbox = this.onChangeVolunteerCheckbox.bind(this);
    this.getLocationFromAddress = this.getLocationFromAddress.bind(this);
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

  getLocationFromAddress(e) {
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
    const submitType = e.target.parentElement.classList[0]
    const url = '/postings';
    const form = document.querySelector('div.add-posting > form');

    const formData = new FormData();
    const request = new XMLHttpRequest();

    const postingData = {
        title: this.state.title,
        address: this.state.address,
        latitude: this.state.lat,
        longitude: this.state.lon,
        employer: this.state.employer,
        scope: this.state.scope,
    };
    const photo = document.querySelector('input[name="photo"]').files[0];
    if (photo !== undefined) {
      formData.append('photo', photo);
    }

    formData.append('posting', JSON.stringify(postingData));
    formData.append('submit_type', submitType);

    axios.post(url, formData)
    .then((response) => {
      if (response.status == 200) {
        this.setState(this.emptyForm);
        const baseUrl = response.data.redirect_url;
        const title = response.data.posting.title;
        const employer = response.data.posting.title;
        const address = response.data.posting.address;
        const latitude = response.data.posting.latitude;
        const longitude = response.data.posting.longitude;
        const redirectUrl = `${baseUrl}?title=${title}&employer=${employer}&address=${address}&latitude=${latitude}&longitude=${longitude}`;
        window.location.href = redirectUrl;
      } else {
        alert("We were unable to save your job posting, please try again!");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
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

  onChangeVolunteerCheckbox() {
    const volunteer = document.getElementById('posting-volunteer-checkbox').checked;
    const scope = volunteer ? 'volunteer' : 'jobs';
    this.setState({scope: scope});
    debugger;
  }

  render () {
    return(
      <section className="add-posting-part-one menu">
        <div className="section-title">
          <h2>Add a posting</h2>
        </div>
        <div className="menu-container">
          <form >

            <div className="about flex-row"> 
              <FileInputWithLabel
                classes='photo'
                labelText='Photo'
                name='photo'
              />
            </div>

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

              <CheckboxWithLabel
                label="Volunteer position" 
                id="posting-volunteer-checkbox"
                onChange={this.onChangeVolunteerCheckbox}
              />

            </div>

            <div className="location flex-row">
              <small className="help-text">Provide either the address of the employer or your current location if you're at the job site.</small>
              <TextInputWithLabel
                classes='address'
                name='address'
                labelText='Address'
                onChange={this.onChangeAddress}
                value={this.state.address}
                onBlur={this.getLocationFromAddress}
              />
              <div className="form-field" >
                <a className="get-location" onClick={this.getLocation}>
                  <i className="fa fa-location-arrow" aria-hidden="true"></i>
                  Use my current location
                </a>
              </div>
            </div>

            <div className="flex-row buttons">
              <div className='submit-btn'>
                <input className='btn' type="submit" value="Submit now" onClick={this.handleSubmitForm}/>
              </div>
              <div className='add-more-btn'>
                <input className='btn' type="submit" value="Add job details" onClick={this.handleSubmitForm}/>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  };
};
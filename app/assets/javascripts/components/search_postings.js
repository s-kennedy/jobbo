class SearchPostings extends React.Component {

  constructor(props) {
    super(props);
    const initialLat = 43.6452817;
    const initialLon = -79.3843036;
    this.state = {
      postings: this.props.postings,
      lat: initialLat,
      lon: initialLon,
      mapBounds: undefined,
    };
    this.map = undefined;

    this.searchJobsByLocation = this.searchJobsByLocation.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.repositionMap = this.repositionMap.bind(this);
    this.getJobPostings = this.getJobPostings.bind(this);
  };

  componentDidMount() {
    this.renderMap();
  }

  renderMap() {
    const mapOptions = {
      center: new google.maps.LatLng(this.state.lat, this.state.lon),
      zoom: 12,
      scrollwheel: false, 
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
    };

    this.map = new google.maps.Map(document.getElementById('search-map'), mapOptions);
  }

  getLocation() {
    return new Promise((resolve, reject) => {
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
        console.log(lat)
        console.log(lon)
        resolve();
      };

      const _geolocationError = (error) => {
        reject();
      };

      navigator.geolocation.getCurrentPosition(_geolocationSuccess, _geolocationError, options);
    });
  }

  getJobPostings() {
    return new Promise((resolve, reject) => {
      const mapBounds = this.state.mapBounds
      const searchParams = {
        northLat: mapBounds.getNorthEast().lat(),
        eastLon: mapBounds.getNorthEast().lng(),
        southLat: mapBounds.getSouthWest().lat(),
        westLon: mapBounds.getSouthWest().lng(),
      };

      const url = '/search';

      fetch(url, {
        method: "POST",
        body: form
      });

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchParams)
      }).then((response) => {
        console.log(response.json());
      })
    });
  };

  repositionMap() {
    return new Promise((resolve, reject) => {
      const newPosition = new google.maps.LatLng(this.state.lat, this.state.lon)
      this.map.setCenter(newPosition);
      this.map.setZoom(14);

      const newBounds = this.map.getBounds();
      this.setState({mapBounds: newBounds});

      resolve();
    });
  };

  searchJobsByLocation() {
    this.getLocation()
      .then(this.repositionMap)
      .then(this.getJobPostings)
      // .then(this.renderMarkers)
  }

  render () {
    return(
      <div className='search'>
        <div className='search-map' id='search-map' style={{height: '100vh', width: '100vw'}}/>
        <section className='search-postings menu'>
          Search job postings
          <button className='search-location' onClick={this.searchJobsByLocation}>
            Search near me
          </button>
        </section>
      </div>
    )
  };
}

module.exports = SearchPostings;

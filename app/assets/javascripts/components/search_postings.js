import axios from 'axios';
import ShowPosting from './show_posting.js';
import { MapStyles, MapOptions } from '../map_config.js';

export default class SearchPostings extends React.Component {

  constructor(props) {
    super(props);
    const initialLat = 43.6452817;
    const initialLon = -79.3843036;
    this.state = {
      postings: this.props.postings,
      filteredPositngs: undefined,
      lat: initialLat,
      lon: initialLon,
      mapBounds: undefined,
      searchQuery: '',
      selectedPosting: this.props.postings[0],
    };
    this.map = undefined;
    this.visibleMarkers = [];

    this.searchJobsByLocation = this.searchJobsByLocation.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.repositionMap = this.repositionMap.bind(this);
    this.getJobPostings = this.getJobPostings.bind(this);
    this.showJobMarkers = this.showJobMarkers.bind(this);
    this.onChangeSearchQuery = this.onChangeSearchQuery.bind(this);
    this.filterJobsBySearchQuery = this.filterJobsBySearchQuery.bind(this);
    this.removeVisibleMarkers = this.removeVisibleMarkers.bind(this);
  };

  componentDidMount() {
    this.renderMap();
  }

  renderMap() {
    this.map = new google.maps.Map(document.getElementById('search-map'), MapOptions);
    this.map.setOptions({ center: new google.maps.LatLng(this.state.lat, this.state.lon),})
    
    google.maps.event.addListener(this.map, 'dragend', () => { 
      this.redrawMapAndMarkers();
    });
  }

  redrawMapAndMarkers() {
    const newBounds = this.map.getBounds();
    this.setState({mapBounds: newBounds});
    this.getJobPostings().then(this.showJobMarkers); 
  }

  getLocation() {
    console.log("getLocation")
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
    console.log("getJobPostings")
    return new Promise((resolve, reject) => {
      const mapBounds = this.state.mapBounds
      const searchParams = {
        northLat: mapBounds.getNorthEast().lat(),
        eastLon: mapBounds.getNorthEast().lng(),
        southLat: mapBounds.getSouthWest().lat(),
        westLon: mapBounds.getSouthWest().lng(),
      };

      const url = '/search';

      axios.get(url, {
        params: searchParams
      })
      .then((response) => {
        if (response.status == 200) {
          this.state.postings = response.data.results;
          this.showJobMarkers();
        }; 
      })
      .catch(function (error) {
        console.log(error);
      });
    });
  };

  showJobMarkers() {
    console.log("showJobMarkers")
    this.visibleMarkers = [];
    const postings = this.state.filteredPostings || this.state.postings;
    const infoWindow = new google.maps.InfoWindow();

    postings.forEach((posting) => {
      const position = new google.maps.LatLng(posting.latitude, posting.longitude);
      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: posting.title
      });

      marker.metadata = { postingId: posting.id }

      marker.addListener('click', () => {
        this.setState({selectedPosting: posting})
        document.getElementById('show-posting').style.visibility = 'visible'
      });

      marker.addListener('mouseover', () => {
        const title = posting.title;
        infoWindow.setContent(title);
        infoWindow.open(this.map, marker);
      })

      this.visibleMarkers.push(marker);
    });
  };


  repositionMap() {
    console.log("repositionMap")
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
      .then(this.showJobMarkers)
  };

  onChangeSearchQuery(e) {
    const value = e.target.value;
    this.setState({searchQuery: value});
    this.filterJobsBySearchQuery(value).then(this.showJobMarkers)
  };

  filterJobsBySearchQuery(query) {
    return new Promise((resolve, reject) => {
      this.removeVisibleMarkers();
      console.log(query);
      if (query == '') {
        console.log("empty string")
        this.setState({filteredPostings: this.state.postings})
      } else {
        const regex = new RegExp(query, 'i')
        const postings = this.state.postings;
        const matches = postings.filter((posting) => {
          return regex.test(posting.title) || regex.test(posting.description)
        })
        this.setState({filteredPostings: matches});
      }
      resolve();
    });
  };

  removeVisibleMarkers() {
    this.visibleMarkers.forEach((marker) => {
      marker.setMap(null);
    });
  }

  render () {
    return(
      <div className='search'>
        <div className='btn-add-posting btn'>
          <a href="/postings/new">
            <i className="fa fa-plus" aria-hidden="true"></i>
            Post a job
          </a>
        </div>
        <div className='search-map' id='search-map' style={{height: '100vh', width: '100vw'}}/>
        <section className='search-postings menu'>
          <div className="title">
            <h2>Search job postings</h2>
          </div>
          <div className="filters">
            <div className="filter">
              <a className='search-location' onClick={this.searchJobsByLocation}>
                <i className="fa fa-location-arrow" aria-hidden="true"></i>Search near me
              </a>
            </div>

            <div className="filter">
              <i className="fa fa-search" aria-hidden="true"></i>Search text
              <input 
                className="seach-query"
                type="text" 
                name="search-query" 
                onChange={this.onChangeSearchQuery}
                value={this.state.searchQuery}
                placeholder="bartender part-time"
              />
            </div>
          </div>
        </section>
        <ShowPosting posting={this.state.selectedPosting} />
      </div>
    )
  };
}


import axios from 'axios';
import ShowPosting from './show_posting.js';
import Map from './map.js';
import SearchFields from './search_fields.js';
import { initialPosition } from '../map_config.js';

export default class SearchPostings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      postings: this.props.postings,
      filteredPostings: this.props.postings,
      lat: initialPosition.lat,
      lon: initialPosition.lon,
      mapBounds: undefined,
      searchQuery: '',
      selectedPosting: this.props.postings[0],
    };

    this.getLocation = this.getLocation.bind(this);
    this.getJobPostings = this.getJobPostings.bind(this);
    this.onChangeSearchQuery = this.onChangeSearchQuery.bind(this);
    this.filterJobsBySearchQuery = this.filterJobsBySearchQuery.bind(this);
    this.onMapMove = this.onMapMove.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
  };

  getLocation() {
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
      console.log(error);
    };

    navigator.geolocation.getCurrentPosition(_geolocationSuccess, _geolocationError, options);
  }

  getJobPostings() {
    const mapBounds = this.state.mapBounds;
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
        this.setState({postings: response.data.results})
        this.filterJobsBySearchQuery(this.state.searchQuery)
      }; 
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  onChangeSearchQuery(e) {
    const value = e.target.value;
    this.setState({searchQuery: value});
    this.filterJobsBySearchQuery(value)
  };

  filterJobsBySearchQuery(query) {
    if (query == '') {
      this.setState({filteredPostings: this.state.postings})
    } else {
      const regex = new RegExp(query, 'i')
      const postings = this.state.postings;
      const matches = postings.filter((posting) => {
        return regex.test(posting.title) || regex.test(posting.description)
      })
      this.setState({filteredPostings: matches});
    }
  };

  onMapMove(newBounds) {
    this.setState({mapBounds: newBounds});
    this.getJobPostings();
  }

  onMarkerClick(posting) {
    this.setState({selectedPosting: posting})
    document.getElementById('show-posting').style.visibility = 'visible'
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
        <Map 
          filteredPostings={this.state.filteredPostings}
          lat={this.state.lat}
          lon={this.state.lon}
          onMove={this.onMapMove}
          onMarkerClick={this.onMarkerClick}
        />
        <SearchFields 
          onLocationSearch={this.getLocation} 
          onChangeSearchQuery={this.onChangeSearchQuery}
          searchQuery={this.state.searchQuery}
        />
        <ShowPosting posting={this.state.selectedPosting} />
      </div>
    )
  };
}


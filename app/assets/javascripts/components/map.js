import { MapOptions } from '../map_config.js';

export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.mapMarkers = [];
  }

  componentDidMount() {
    this.renderMap();
    this.renderMapMarkers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lat !== this.props.lat || nextProps.lon !== this.props.lon) {
      this.repositionMap();
    }

    // find a better way to detect difference
    if (nextProps.filteredPostings.length !== this.props.filteredPostings.length) {
      this.renderMapMarkers()
    }
  }

  renderMap() {
    this.map = new google.maps.Map(document.getElementById('search-map'), MapOptions);
    this.map.setOptions({ center: new google.maps.LatLng(this.props.lat, this.props.lon),})
    
    google.maps.event.addListener(this.map, 'dragend', () => { 
      const newBounds = this.map.getBounds()
      this.props.onMove(newBounds);
    });

    google.maps.event.addListener(this.map, 'zoom_changed', () => { 
      const newBounds = this.map.getBounds()
      this.props.onMove(newBounds);
    });
  }

  renderMapMarkers() {
    this.removeVisibleMarkers()
    const postings = this.props.filteredPostings;
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
        this.props.onMarkerClick(posting);
      });

      marker.addListener('mouseover', () => {
        const title = posting.title;
        infoWindow.setContent(title);
        infoWindow.open(this.map, marker);
      })

      this.mapMarkers.push(marker);
    });
  };


  repositionMap() {
    const newPosition = new google.maps.LatLng(this.props.lat, this.props.lon)
    this.map.setCenter(newPosition);
    this.map.setZoom(15);

    const newBounds = this.map.getBounds();
    this.props.onMove(newBounds);
  };

  removeVisibleMarkers() {
    this.mapMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    this.mapMarkers = [];
  }

  render() {
    return (
      <div className='search-map' id='search-map' style={{height: '100vh', width: '100vw'}}
      />
    )
  }
}
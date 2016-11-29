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

  componentDidUpdate(prevProps) {
    if (prevProps.lat !== this.props.lat || prevProps.lon !== this.props.lon) {
      this.repositionMap();
    }

    // find a better way to detect difference
    if (prevProps.filteredPostings.length !== this.props.filteredPostings.length) {
      this.renderMapMarkers()
    }
  }

  renderMap() {
    this.map = new google.maps.Map(document.getElementById('search-map'), MapOptions);
    this.map.setOptions({ center: new google.maps.LatLng(this.props.lat, this.props.lon),})

    google.maps.event.addListener(this.map, 'tilesloaded', () => {
      this.props.onMapLoad(this.map.getBounds());
    })
    
    google.maps.event.addListener(this.map, 'dragend', () => { 
      this.props.onMove(this.map.getBounds());
    });

    google.maps.event.addListener(this.map, 'zoom_changed', () => { 
      this.props.onMove(this.map.getBounds());
    });
  }

  renderMapMarkers() {
    this.removeVisibleMarkers();
    const postings = this.props.filteredPostings;
    const infoWindow = new google.maps.InfoWindow();

    postings.forEach((posting) => {
      const position = new google.maps.LatLng(posting.latitude, posting.longitude);
      const markerColor = posting.scope === "jobs" ? 'FF7566' : 'FFDF00'
      const marker = new StyledMarker({
        styleIcon: new StyledIcon(StyledIconTypes.MARKER, {color: markerColor}),
        position: position,
        map: this.map,
        title: posting.title,
      });

      marker.metadata = { postingId: posting.id }

      marker.addListener('click', () => {
        this.props.onMarkerClick(posting);
      });

      marker.addListener('mouseover', () => {
        const title = posting.scope === "jobs" ? posting.title : `[Volunteer] ${posting.title}`;
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
      <div className='search-map' id='search-map' />
    )
  }
}
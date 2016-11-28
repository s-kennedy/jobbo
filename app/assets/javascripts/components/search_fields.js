export default class SearchFields extends React.Component {

  render() {
    return (
      <section className='search-postings menu'>
        <div className="section-title">
          <h2>Search job postings</h2>
        </div>
        <div className="menu-container">
          <div className="filters">
            <div className="filter">
              <a className='search-location' onClick={this.props.onLocationSearch}>
                <i className="fa fa-location-arrow" aria-hidden="true"></i>Search near me
              </a>
            </div>

            <div className="filter">
              <i className="fa fa-search" aria-hidden="true"></i>Search text
              <input 
                className="seach-query"
                type="text" 
                name="search-query" 
                onChange={this.props.onChangeSearchQuery}
                value={this.props.searchQuery}
                placeholder="bartender part-time"
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
}
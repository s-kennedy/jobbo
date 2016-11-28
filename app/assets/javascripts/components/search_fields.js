export default class SearchFields extends React.Component {

  render() {
    const scope = this.props.scope;
    const title = scope === "jobs" ? "Job postings" : "Volunteer opportunities"
    const placeholderText = scope === "jobs" ? "part-time" : "civic tech"
    return (
      <section className={`search-postings menu ${scope}`}>
        <div className="section-title">
          <h2>{title}</h2>
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
                placeholder={placeholderText}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
}
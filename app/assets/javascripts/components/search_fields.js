import CheckboxWithLabel from './checkbox_with_label.js'

export default class SearchFields extends React.Component {

  volunteerCheckbox() {
    if (this.props.scope === "volunteer") {
      return (
        <div className="filter">
          <CheckboxWithLabel 
            label="Show volunteer positions only" 
            onChange={this.props.onCheckVolunteerOption}
            id="volunteer-checkbox"
          />
        </div>
      );
    }
  };

  render() {
    const scope = this.props.scope;
    const title = scope === "jobs" ? "Job postings" : "Volunteer opportunities";
    const placeholderText = scope === "jobs" ? "part-time" : "civic tech";
    return (
      <section className={`search-postings menu ${scope}`}>
        <div className="section-title">
          <h2>{title}</h2>
        </div>
        <div className="menu-container">
          <div className="filters">
            {this.volunteerCheckbox()}
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
                placeholder={placeholderText}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
}
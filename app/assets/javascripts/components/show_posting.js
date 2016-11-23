import axios from 'axios';
import ParagraphWithLabel from './paragraph_with_label.js'

export default class ShowPosting extends React.Component {

  constructor(props) {
    super(props);
  };

  componentWillUpdate() {
    console.log("UPDATING POSTING")
    console.log(this.props.posting)
  }

  closePostingSection() {
    document.getElementById('show-posting').style.visibility = 'collapse';
  }

  renderJobDetails() {
    const allDetails = ['employer', 'description', 'salary', 'schedule', 'address', 
  'phone', 'email', 'source', 'date_posted']

    return allDetails.map((detail) => {
      const detailText = this.props.posting[detail]
      console.log(detail, detailText);
      if (detailText != null && detailText.length > 0) {
        return (
          <ParagraphWithLabel
            key={detail}
            detailLabel={detail}
            detailText={this.props.posting[detail]}
          />
        )
      }
    });
  }

  render() {
    const imageSrc = this.props.posting.image_src || '';
    const detailsToShow = this.renderJobDetails();

    return(
      <section className="show-posting" id="show-posting" style={{visibility: 'collapse'}}>
        <div className="posting-container">
          <a className="close-posting" onClick={this.closePostingSection}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </a>
          <h1>{this.props.posting.title}</h1>

          <img src={imageSrc} />

          {detailsToShow}

        </div>
      </section>
    );
  };
};
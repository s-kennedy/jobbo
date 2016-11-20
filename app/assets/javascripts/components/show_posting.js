import axios from 'axios';

export default class ShowPosting extends React.Component {

  constructor(props) {
    super(props);
  };

  componentWillUpdate() {
    console.log("UPDATING POSTING")
  }

  closePostingSection() {
    document.getElementById('show-posting').style.visibility = 'collapse';
  }

  render() {
    const imageSrc = this.props.posting.image_src || '';

    return(
      <section className="show-posting" id="show-posting" style={{visibility: 'collapse'}}>
        <div className="posting-container">
          <a className="close-posting" onClick={this.closePostingSection}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </a>
          <h1>{this.props.posting.title}</h1>
          <p>{this.props.posting.description}</p>
          <p>{this.props.posting.address}</p>
          <img src={imageSrc} />
        </div>
      </section>
    );
  };
};
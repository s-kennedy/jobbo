export default class ParagraphWithLabel extends React.Component {

  render() {
    return(
      <div className={`job-detail`} key={this.props.key}>
        <p>
        <span className={`detail-title`}>{this.props.detailLabel} - </span>
        {this.props.detailText}
        </p>
      </div>
    );
  };
};
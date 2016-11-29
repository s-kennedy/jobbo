export default class CheckboxWithLabel extends React.Component {

  render() {
    return(
      <div className="checkbox">
        <input type="checkbox" name="checkbox" id={this.props.id} value="1" onChange={this.props.onChange} />
        <label htmlFor="checkbox">{this.props.label}</label>
      </div>
    );
  };
};
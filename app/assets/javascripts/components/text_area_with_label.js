export default class TextAreaWithLabel extends React.Component {

  render() {
    return(
      <div className={`form-field ${this.props.classes}`} >
        <label htmlFor={this.props.name}>{this.props.labelText}</label>
        <br />
        <textarea 
          type="text" 
          name={this.props.name} 
          onChange={this.props.onChange} 
          value={this.props.value}
        />
      </div>
    );
  };
};
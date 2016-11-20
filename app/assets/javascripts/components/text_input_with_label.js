export default class TextInputWithLabel extends React.Component {

  render() {
    return(
      <div className={`form-field ${this.props.classes}`} >
        <label htmlFor={this.props.name}>{this.props.labelText}</label>
        <br />
        <input 
          type="text" 
          name={this.props.name} 
          onChange={this.props.onChange} 
          onBlur={this.props.onBlur}
          value={this.props.value}
        />
      </div>
    );
  };
};
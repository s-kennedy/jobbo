export default class FileInputWithLabel extends React.Component {

  render() {
    return(
      <div className={`form-field ${this.props.classes}`} >
        <label htmlFor={this.props.name}>{this.props.labelText}</label>
        <br />
        <input 
          type="file" 
          name={this.props.name}
        />
      </div>
    );
  };
};
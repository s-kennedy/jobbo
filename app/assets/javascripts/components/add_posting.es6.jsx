class AddPosting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      photo: null,
      address: '',
      phone: '',
      email: '',
      source: '',
    };

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeSource = this.onChangeSource.bind(this);
  }

  handleSubmitForm(e) {
    e.preventDefault();
    console.log('submit!')
    const form = document.querySelector('div.add-posting > form');
    const postingData = {
        title: this.state.title,
        description: this.state.description,
        photo: null,
        address: this.state.address,
        phone: this.state.phone,
        email: this.state.email,
        source: this.state.source, 
    }
    const url = '/postings';
    const xmlhttp = new XMLHttpRequest();

    var request = new XMLHttpRequest();
    request.onload = (res) => {
      console.log(request.response)
    };
    request.open("post", "/postings");
    var fd = new FormData();
    fd.append('posting', JSON.stringify(postingData))
    request.send(fd);
  };

  onChangeTitle(e) {
    const value = e.target.value;
    this.setState({title: value});
  };

  onChangeDescription(e) {
    const value = e.target.value;
    this.setState({description: value});
  };

  onChangeAddress(e) {
    const value = e.target.value;
    this.setState({address: value});
  };

  onChangePhone(e) {
    const value = e.target.value;
    this.setState({phone: value});
  };

  onChangeEmail(e) {
    const value = e.target.value;
    this.setState({email: value});
  };

  onChangeSource(e) {
    const value = e.target.value;
    this.setState({source: value});
  };

  render () {
    return(
      <div className="add-posting">
        <form onSubmit={this.handleSubmitForm}>
          <div className="input">
            Title:
            <input 
              type="text" 
              name="title" 
              onChange={this.onChangeTitle} 
              value={this.state.title}
            />
          </div>

          <div className="input">
            Description:
            <textarea 
              name="description" 
              onChange={this.onChangeDescription}
              value={this.state.description}
            />
          </div>

          <div className="input">
            Photo:
            <input 
              type="file" 
              name="photo"
            />
          </div>

          <div className="input">
            Address:
            <input 
              type="text" 
              name="address" 
              onChange={this.onChangeAddress}
              value={this.state.address}
            />
          </div>

          <div className="input">
            Contact:
            <input 
              type="text" 
              name="phone" 
              onChange={this.onChangePhone}
              value={this.state.phone}
            />
          </div>

          <div className="input">
            Contact:
            <input 
              type="text" 
              name="email" 
              onChange={this.onChangeEmail}
              value={this.state.email}
            />
          </div>

          <div className="input">
            Source:
            <input 
              type="text" 
              name="source" 
              onChange={this.onChangeSource}
              value={this.state.source}
            />
          </div>

          <div className="btn-submit">
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  };
}


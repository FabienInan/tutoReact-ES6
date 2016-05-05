import React from 'react';
import Repos from './GitHub/Repos';
import UserProfile from './GitHub/UserProfile';
import Notes from './Notes/Notes';
import getGithubInfo from '../utils/helper';
import Rebase from 're-base';

const base = Rebase.createClass('https://first-tuto-react.firebaseio.com/');

class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      notes: [],
      bio: {},
      repos: []
    }
  }
  getInitialState(){
    return{
      notes: [1,2,3],
      bio: {
        name : 'Fabien Inan'
      },
      repos: ['repo1','repo2']
    }
  }
  componentDidMount(){
    this.init(this.props.params.username);
  }
  componentWillReceiveProps(nextProps){
    base.removeBinding(this.ref);
    this.init(nextProps.params.username);
  }
  componentWillUnmount(){
    base.removeBinding(this.ref);
  }
  init(newUsername){
    this.ref = base.bindToState(newUsername, {
      context: this,
      asArray: true,
      state: 'notes'
    });

    getGithubInfo(newUsername)
      .then((data) =>
        this.setState({
          bio: data.bio,
          repos: data.repos
        }));
  }
  handleAddNote(newNote){
    base.post(this.props.params.username, {
      data: this.state.notes.concat([newNote])
    })
  }
  render(){
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={this.props.params.username} bio={this.state.bio} />
        </div>
        <div className="col-md-4">
          <Repos username={this.props.params.username} repos={this.state.repos} />
        </div>
        <div className="col-md-4">
          <Notes
            username={this.props.params.username}
            notes={this.state.notes}
            addNote={(newNote) => this.handleAddNote(newNote)} />
        </div>
      </div>
    )
  }
};

export default Profile;

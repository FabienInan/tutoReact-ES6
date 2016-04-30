var React = require('react');
var Router = require('react-router');
import Repos from './GitHub/Repos';
import UserProfile from './GitHub/UserProfile';
import Notes from './Notes/Notes';
var ReactFireMixIn = require('reactfire');
var Firebase = require('firebase');
import getGithubInfo from '../utils/helper';

var Profile = React.createClass({
  mixins: [ReactFireMixIn],
  getInitialState: function(){
    return{
      notes: [1,2,3],
      bio: {
        name : 'Fabien Inan'
      },
      repos: ['repo1','repo2']
    }
  },
  componentDidMount: function(){
    this.ref = new Firebase('https://first-tuto-react.firebaseio.com/');
    this.init(this.props.params.username);
  },
  componentWillReceiveProps: function(nextProps){
    this.unbind('notes');
    this.init(nextProps.params.username);
  },
  componentWillUnmount: function(){
    this.unbind('notes');
  },
  init: function(newUsername){
    var childRef = this.ref.child(newUsername);
    this.bindAsArray(childRef, 'notes');

    getGithubInfo(newUsername)
      .then(function(data){
        this.setState({
          bio: data.bio,
          repos: data.repos
        })
      }.bind(this));
  },
  handleAddNote: function(newNote){
    this.ref.child(this.props.params.username).child(this.state.notes.length).set(newNote);
  },
  render: function(){
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
            addNote={this.handleAddNote} />
        </div>
      </div>
    )
  }
});

module.exports = Profile;

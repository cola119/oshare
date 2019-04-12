import React, { Component } from 'react';
import firebase from './firebase';
import SignInScreen from './components/SignInScreen';

class App extends Component {
  state = {
    loading: true,
    user: null
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        loading: false,
        user: user
      });
    });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      // console.log("logout");
    });
  }

  render() {
    if (this.state.loading) return <div>loading</div>;
    return (
      <div>
        Username: {this.state.user && this.state.user.displayName}
        <br />
        {this.state.user ?
          (<button onClick={this.logout}>Logout</button>) :
          (<SignInScreen />)
        }
      </div>
    );
  }
}

export default App;

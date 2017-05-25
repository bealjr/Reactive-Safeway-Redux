import React, { Component } from 'react';
import { connect } from 'react-redux';
import { calculateRoute } from '../actions/route_actions';

class App extends Component {
    componentWillMount() {
        this.props.calculateRoute();
    }
  render() {
      console.log(this.props.route, `i'm the route!`)
    return (
      <div className="App">
          App
      </div>
    );
  }
}



export default connect(({ route }) => ({ route }), { calculateRoute })(App);

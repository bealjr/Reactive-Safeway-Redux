import React, { Component } from 'react';
import { connect } from 'react-redux';
import { calculateRoute } from '../actions/route_actions';
import RouteMap from './Map';
import UserInput from './UserInput';

class App extends Component {
    
  render() {
      console.log(this.props.route, `i'm the route!`)
    return (
      <div className="container" style={{marginTop: "5%"}}>
          <div className="row">
              <div className="col-md-6">
                  <UserInput></UserInput>
              </div>
              <div className="col-md-6">
          <RouteMap></RouteMap>
              </div>
          </div>
      </div>
    );
  }
}



export default connect(({ route }) => ({ route }), { calculateRoute })(App);

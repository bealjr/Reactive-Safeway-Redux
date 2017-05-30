import React, {Component} from 'react';
import {connect} from 'react-redux';
import {calculateRoute, deleteRoute} from '../actions/route_actions';
import {updateOrigin, updateDestination} from '../actions/input_actions';


class UserInput extends Component{
    constructor(props){
        super(props);

    }
    updateOrigin(event){
        this.props.updateOrigin(event.target.value)
    }
    updateDestination(event){
        this.props.updateDestination(event.target.value)
    }
    getSafeRoute(event){
        event.preventDefault();
        this.props.deleteRoute()
        this.props.calculateRoute(this.props.input)
        // this.setState({origin:"", destination:""})
    }
    render(){
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="origin">Origin</label>
                    <input type="text" className="form-control" id="origin" value={this.props.input.origin} placeholder="Enter your location!"
                    onChange={this.updateOrigin.bind(this)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="destination">Destination</label>
                    <input type="text" className="form-control" id="destination" value={this.props.input.destination} placeholder="Enter your destination!"
                    onChange={this.updateDestination.bind(this)}
                    />
                </div>
                <button onClick={this.getSafeRoute.bind(this)} type="submit" className="btn btn-primary">Find The SafeWay!</button>
            </form>
        )
    }
}
export default connect(({input}) => ({input}),{calculateRoute, updateOrigin, updateDestination, deleteRoute})(UserInput);
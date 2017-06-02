import React, {Component} from 'react';
import {connect} from 'react-redux';
import {calculateRoute, deleteRoute} from '../actions/route_actions';
import {updateOrigin, updateDestination} from '../actions/input_actions';


const UserInput = ({input, updateOrigin, updateDestination, deleteRoute, calculateRoute}) => {

    const getSafeRoute = (event) => {
        event.preventDefault();
        deleteRoute();
        calculateRoute(input)
    };
    return (
        <form>
            <div className="form-group">
                <label htmlFor="origin">Origin</label>
                <input type="text" className="form-control" id="origin" value={input.origin}
                       placeholder="Enter your location!"
                       onChange={(event) => updateOrigin(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="destination">Destination</label>
                <input type="text" className="form-control" id="destination" value={input.destination}
                       placeholder="Enter your destination!"
                       onChange={(event) => updateDestination(event.target.value)}
                />
            </div>
            <button onClick={(event) => getSafeRoute(event)} type="submit" className="btn btn-primary">Find The SafeWay!</button>
        </form>
    )

}
export default connect(({input}) => ({input}), {
    calculateRoute,
    updateOrigin,
    updateDestination,
    deleteRoute
})(UserInput);
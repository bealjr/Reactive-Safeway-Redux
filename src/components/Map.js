import React from 'react';
import {connect} from 'react-redux';

const RouteMap = ({route, input}) => {
    const API_KEY = 'AIzaSyB_bxE5lh7F4AjtnhzSkTgPUAdj4Qy7x8M';
    let lat = 37.788442
    let lng = -122.464519;

    if (route.length === 0) {
        return (
            <iframe
                width="600"
                height="450"
                frameBorder="0" style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin='San Francisco'&destination='San Francisco'`}
                allowFullScreen
            />
        );
    }
    const origin = input.origin.split(',').join(" and ")
    const destination = input.destination.split(',').join(" and ")

    console.log(route, " this is our route")

    return (
        <iframe
            width="600"
            height="450"
            frameBorder="0" style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${origin}&destination=${destination}&waypoints=${route}`}
            allowFullScreen
        />
    );
};

    export default connect(({route, input}) => ({route, input}))(RouteMap);

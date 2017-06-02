import React from 'react';
import RouteMap from './Map';
import UserInput from './UserInput';

const App = () => (
    <div className="container" style={{marginTop: "5%"}}>
        <div className="row">
            <div className="col-md-6">
                <UserInput />
            </div>
            <div className="col-md-6">
                <RouteMap />
            </div>
        </div>
    </div>
);


export default App;

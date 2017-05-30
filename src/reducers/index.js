import { combineReducers } from "redux";
import route from "./route_reducer";
import input from "./input_reducer"
import directions from './directions_reducer';

const rootReducer = combineReducers({ route, input, directions });

export default rootReducer;

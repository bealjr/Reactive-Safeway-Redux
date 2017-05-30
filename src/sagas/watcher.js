import { takeLatest } from 'redux-saga/effects';
import * as type from '../constants/actionTypes';
import { calculateRoute } from './route_saga';
import { getDirections } from './waypoints_saga';

export default function* watchRoutes(){
	yield takeLatest(type.CALCULATE_ROUTE, calculateRoute);
	yield takeLatest(type.GET_WAYPOINTS, getDirections);
}

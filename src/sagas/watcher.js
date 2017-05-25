import { takeEvery } from 'redux-saga/effects';
import * as type from '../constants/actionTypes';
import { calculateRoute } from './route_saga';

export default function* watchRoutes(){
	yield takeEvery(type.CALCULATE_ROUTE, calculateRoute);
}

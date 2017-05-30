import { put, call, all } from 'redux-saga/effects';

import * as type from '../constants/actionTypes';
import userInput from '../algorithm/searchingAlgorithm';

export function* calculateRoute({ payload }) {
  console.log('i\'m hit!');
  console.log(payload, " THE PAYLOAD")
  try {
    const {origin, destination} = payload
    const response = yield call(userInput, origin, destination);
    yield [put({ type: type.GET_WAYPOINTS, payload: response }),
    put({type: type.GET_DIRECTIONS, payload: response})]

  } catch (error) {
    yield put({ type: type.FAILED_ROUTE, payload: error });
  }
}

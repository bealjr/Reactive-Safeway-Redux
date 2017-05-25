import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as type from '../constants/actionTypes';
import userInput from '../algorithm/searchingAlgorithm';

export function* calculateRoute({ payload }){
	// const { location, destination } = payload;
	console.log(`i'm hit!`)
	try {
		let location = 'CAPRA WAY,SCOTT ST';
		let destination = 'FRANCISCO ST,BAKER ST';
		const response = yield delay(userInput(location, destination), 150000)
		console.log(response, `i'm the response`)
		yield put({ type: type.ADD_ROUTE, payload: response })
	} catch(error){
		yield put({ type: type.FAILED_ROUTE, payload: error})
	}
}

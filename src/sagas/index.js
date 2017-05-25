import { fork } from 'redux-saga/effects';
import watchRoutes from './watcher';

export default function* rootSaga() {
	yield fork(watchRoutes);
}

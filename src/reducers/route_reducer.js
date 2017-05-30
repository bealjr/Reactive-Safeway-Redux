import * as type from "../constants/actionTypes"

export default function (state = [], action){
	switch (action.type) {
		case type.ADD_ROUTE:
			return action.payload
		case type.DELETE_ROUTE:
			return [];
		default:
			return state

	}
}

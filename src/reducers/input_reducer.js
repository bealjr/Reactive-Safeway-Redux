import * as type from '../constants/actionTypes';

const initialState = {
    origin: 'SCOTT ST,CAPRA WAY',
    destination: 'FRANCISCO ST,BAKER ST',
}

export default function(state = initialState, action) {
    switch(action.type) {
        case type.UPDATE_ORIGIN:
            return {
                ...state,
                origin: action.payload
            }
        case type.UPDATE_DESTINATION:
            return {
                ...state,
                destination: action.payload
            }
        default: return state
    }
}
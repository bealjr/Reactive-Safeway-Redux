import * as type from '../constants/actionTypes'

export default function (state = [], action){
    console.log(action, "this is our action from direction reducer")
    switch (action.type){
        case type.GET_DIRECTIONS:
            return action.payload
        default: return state
    }
}
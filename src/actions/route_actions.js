import * as type from '../constants/actionTypes'

export const calculateRoute = (payload) => ({ type : type.CALCULATE_ROUTE, payload })
export const deleteRoute = () => ({type : type.DELETE_ROUTE})

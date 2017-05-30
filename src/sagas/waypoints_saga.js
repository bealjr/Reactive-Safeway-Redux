import { call, put } from 'redux-saga/effects';
import * as type from '../constants/actionTypes';
import  convertIntersectionLatLng  from '../algorithm/getLatLng';

const getLatLng = (data) => {
  const result = [data[0].intersection1];
  let currStreet;

  for (let i = 1; i < data.length; i++) {
    const commonStreetTest1 = data[i].intersection1[0]
    const commonStreetTest2 = data[i].intersection1[1]

    if(currStreet === undefined){
      if(commonStreetTest1 === data[i-1].intersection1[0] || commonStreetTest1 === data[i-1].intersection1[1]){
        currStreet = commonStreetTest1;
      }
      if(commonStreetTest2 === data[i-1].intersection1[0] || commonStreetTest2 === data[i-1].intersection1[1]) {
        currStreet = commonStreetTest2;
      }
    }

    if(!commonStreetTest1.includes(currStreet) && !commonStreetTest2.includes(currStreet)){
      result.push(data[i - 1].intersection1)
    }
    if(commonStreetTest1 === data[i-1].intersection1[0] || commonStreetTest1 === data[i-1].intersection1[1]){
      currStreet = commonStreetTest1;
    }
    if(commonStreetTest2 === data[i-1].intersection1[0] || commonStreetTest2 === data[i-1].intersection1[1]){
      currStreet = commonStreetTest2;
    }
  }

  result.push(data[data.length -1].intersection1)
  console.log(result, " this is our result.")
  
  return createWaypoints(result);
};

function createWaypoints(array){
  console.log(array, " this is our input array")
  let stringifiedWaypoints = '';

  for(let i = 1; i < array.length; i++){
    const lat = array[i][0];
    const lng = array[i][1];

    if(i === array.length - 1){
      stringifiedWaypoints += `${lat}+%26+${lng}`
    } else {

      stringifiedWaypoints += `${lat}+%26+${lng}|`
    }
  }
  console.log(stringifiedWaypoints, "STRINGIFIED WAYPOINTS")
  return stringifiedWaypoints;
}
export function* getDirections({ payload }) {
  console.log(payload);

  
  

  try {
    const results = yield call(getLatLng, payload)
    console.log(results, "$%^&$%FGDH")

    yield put({ type: type.ADD_ROUTE, payload:results });

  } catch (error) {
    console.log(error);
  }
}

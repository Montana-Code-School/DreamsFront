import { 
  RECEIVED_DREAMS, 
  REQUEST_DREAMS, 
  SELECT_DREAM, 
  ADD_NEW_OR_UPDATE_DREAM, 
  DELETE_DREAM,
  ERROR_SIGN_OUT
} from "../Constants/actionTypes";

import * as ROUTES from '../Constants/routes';

const { REACT_APP_BACKEND_URL } = process.env;

function receivedDreams(payload) {
  return {
    type: RECEIVED_DREAMS,
    payload
  }
}
function requestDreams() {
  return {
    type: REQUEST_DREAMS,
  }
}
export function selectDream(payload) {
  return {
    type: SELECT_DREAM,
    payload
  }
}
export function addNewOrUpdateDream(payload) {
  return {
    type: ADD_NEW_OR_UPDATE_DREAM,
    payload
  }
}
export function deleteDream(id) {
  return {
    type: DELETE_DREAM,
    payload: {id},
  }
}

export function errorOnSignOut(h) {
  h.push(ROUTES.ERROR_SIGN_OUT);
  return {
    type: ERROR_SIGN_OUT,
  }
}

export function fetchDreams(userID, props) {
  return function(dispatch, getState){
    console.log("got past that funcion nonsense");
    if(getState().dreams.length) return;
    dispatch(requestDreams());
    return fetch(`${REACT_APP_BACKEND_URL}/secure/dreams/?userId=${userID}`, {credentials: "include"})
      .then(response => {
        // if (response.status === 401){
        //   dispatch(errorOnSignOut(props.history))
        // }
        return response.json()
      })
      .then((dreams) => {
        console.log("resolved");
        dreams = dreams.reverse();
        dispatch(receivedDreams(dreams));
      })
      .catch(function(error) {
        // Handle error
        console.log("error", error);
        // this.props.history.push(ROUTES.ERROR_SIGN_OUT)
        // dispatch(errorOnSignOut(props.history))
      });
  }
}

export function saveDream(dream, isNew, promiseResolver, props ) {
  return function(dispatch, getState){
    fetch(`${REACT_APP_BACKEND_URL}/dreams`, {
      method: isNew ? "POST" : "PUT",
      body: JSON.stringify(dream),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (response.status === 401){
      // this.props.history.push(ROUTES.ERROR_SIGN_OUT)
      dispatch(errorOnSignOut(props.history))
      }
      return response.json()
    })
    .then((myJson) => {
      dispatch(addNewOrUpdateDream(myJson));
      promiseResolver();
    })
    .catch(function(error) {
      // Handle error
      console.log("error");
      dispatch(errorOnSignOut(props.history))
    });
  }
}

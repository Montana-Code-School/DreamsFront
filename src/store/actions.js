import { 
  RECEIVED_DREAMS, 
  REQUEST_DREAMS, 
  SELECT_DREAM, 
  ADD_NEW_OR_UPDATE_DREAM, 
  DELETE_DREAM 
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
export function fetchDreams(userID) {
  return function(dispatch, getState){
    if(getState().dreams.length) return;
    dispatch(requestDreams());
    return fetch(`${REACT_APP_BACKEND_URL}/dreams/?userId=${userID}`, {credentials: "include"})
      .then(response => {
        if (response.status === 401){
          // Firebase.doSignOut();
          this.props.history.push(ROUTES.SIGN_IN)
        }
        return response.json()
      })
      .then((dreams) => {
        dreams = dreams.reverse();
        dispatch(receivedDreams(dreams));
      })
      .catch(function(error) {
        // Handle error
        console.log("error", error);
      });
  }
}
export function saveDream(dream, isNew, promiseResolver) {
  return function(dispatch, getState){
    fetch(`${REACT_APP_BACKEND_URL}/dreams`, {
      method: isNew ? "POST" : "PUT",
      body: JSON.stringify(dream),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then((myJson) => {
      dispatch(addNewOrUpdateDream(myJson));
      promiseResolver();
    })
    .catch(function(error) {
      // Handle error
      console.log("error");
    });
  }
}

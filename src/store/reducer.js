import { removeItem } from './helpers'

const initialState = {
  dreams: [],
  currentDream: {},
  isFetchingDreams: false,
}

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVED_DREAMS":
      return {
        ...state,
        dreams: action.payload,
        isFetchingDreams: false,
      };
    case "REQUEST_DREAMS":
      return {
        ...state,
        isFetchingDreams: true,
      };
    case "SELECT_DREAM":
      return {
        ...state,
        currentDream: action.payload,
      }
    case "ADD_NEW_OR_UPDATE_DREAM":{
      const dreams = [...state.dreams];
      removeItem(dreams, action.payload._id)
      return {
        ...state,
        dreams: [action.payload, ...dreams]
      }
    }
    case "DELETE_DREAM":
      const dreams = [...state.dreams];
      removeItem(dreams, action.payload.id)
      return {
        ...state,
        dreams,
      }
    default: return state;
  }
}
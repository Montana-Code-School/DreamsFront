import { removeItem } from './helpers'
import { 
  RECEIVED_DREAMS, 
  REQUEST_DREAMS, 
  SELECT_DREAM, 
  ADD_NEW_OR_UPDATE_DREAM, 
  DELETE_DREAM 
} from "../Constants/actionTypes";

const initialState = {
  dreams: [],
  currentDream: {},
  isFetchingDreams: false,
}

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_DREAMS:
      return {
        ...state,
        dreams: action.payload,
        isFetchingDreams: false,
      };
    case REQUEST_DREAMS:
      return {
        ...state,
        isFetchingDreams: true,
      };
    case SELECT_DREAM:
      return {
        ...state,
        currentDream: action.payload,
      }
    case ADD_NEW_OR_UPDATE_DREAM:{
      const dreams = [...state.dreams];
      removeItem(dreams, action.payload._id)
      return {
        ...state,
        dreams: [action.payload, ...dreams]
      }
    }
    case DELETE_DREAM:
      const dreams = [...state.dreams];
      removeItem(dreams, action.payload.id)
      return {
        ...state,
        dreams,
      }
    default: return state;
  }
}

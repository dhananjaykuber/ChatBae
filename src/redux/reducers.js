import {
  SET_USER_NUMBER,
  SET_USER_NAME,
  SET_USER_PROFILE_IMAGE,
} from './actions';

const initialState = {
  number: '',
  name: '',
  userProfileImage: '',
};

function useReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_NUMBER:
      return {...state, number: action.payload};
    case SET_USER_NAME:
      return {...state, name: action.payload};
    case SET_USER_PROFILE_IMAGE:
      return {...state, userProfileImage: action.payload};
    default:
      return state;
  }
}

export default useReducer;

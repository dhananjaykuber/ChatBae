export const SET_USER_NUMBER = 'SET_USER_NUMBER';
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_USER_PROFILE_IMAGE = 'SET_USER_PROFILE_IMAGE';

export const setNumber = number => dispatch => {
  dispatch({
    type: SET_USER_NUMBER,
    payload: number,
  });
};

export const setName = name => dispatch => {
  dispatch({
    type: SET_USER_NAME,
    payload: name,
  });
};

export const setUserProfileImage = userProfileImage => dispatch => {
  dispatch({
    type: SET_USER_PROFILE_IMAGE,
    payload: userProfileImage,
  });
};

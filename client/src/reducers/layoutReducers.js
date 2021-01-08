import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from '../constants/layoutConstants';

const initialState = {
  sidebar: false, // false means it is not shown
};

export const layoutReducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case SIDEBAR_OPEN:
      return {
        ...state,
        sidebar: true,
      };
    case SIDEBAR_CLOSE:
      return {
        ...state,
        sidebar: false,
      };
    default:
      return state;
  }
};

import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from '../constants/layoutConstants';

export const openSidebar = () => async (dispatch) => {
  dispatch({
    type: SIDEBAR_OPEN,
  });
};

export const closeSideBar = () => async (dispatch) => {
  dispatch({
    type: SIDEBAR_CLOSE,
  });
};

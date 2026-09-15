import { ActionType } from './action';

function loadingReducer(state = 0, action = {}) {
  switch (action.type) {
  case ActionType.SHOW_LOADING:
    return state + 1;
  case ActionType.HIDE_LOADING:
    return Math.max(0, state - 1);
  default:
    return state;
  }
}

export default loadingReducer;

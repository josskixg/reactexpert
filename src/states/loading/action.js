const ActionType = {
  SHOW_LOADING: 'loading/show',
  HIDE_LOADING: 'loading/hide',
};

function showLoadingActionCreator() {
  return {
    type: ActionType.SHOW_LOADING,
  };
}

function hideLoadingActionCreator() {
  return {
    type: ActionType.HIDE_LOADING,
  };
}

export {
  ActionType,
  showLoadingActionCreator,
  hideLoadingActionCreator,
};

import { ActionType } from './action';

const initialState = {
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  onConfirm: null,
  confirmText: 'Mengerti',
  cancelText: null,
};

function modalReducer(state = initialState, action = {}) {
  switch (action.type) {
  case ActionType.SHOW_MODAL:
    return {
      ...state,
      ...action.payload,
      isOpen: true,
    };
  case ActionType.HIDE_MODAL:
    return {
      ...state,
      isOpen: false,
      onConfirm: null,
    };
  default:
    return state;
  }
}

export default modalReducer;

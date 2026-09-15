const ActionType = {
  SHOW_MODAL: 'modal/show',
  HIDE_MODAL: 'modal/hide',
};

function showModalActionCreator({
  title = 'Pemberitahuan',
  message = '',
  type = 'info', // 'info' | 'error' | 'success' | 'confirm'
  onConfirm = null,
  confirmText = 'Mengerti',
  cancelText = null,
}) {
  return {
    type: ActionType.SHOW_MODAL,
    payload: {
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      confirmText,
      cancelText,
    },
  };
}

function hideModalActionCreator() {
  return {
    type: ActionType.HIDE_MODAL,
  };
}

export {
  ActionType,
  showModalActionCreator,
  hideModalActionCreator,
};

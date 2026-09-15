import api from '../../api/api';
import { showLoadingActionCreator, hideLoadingActionCreator } from '../loading/action';
import { showModalActionCreator } from '../modal/action';

const ActionType = {
  RECEIVE_USERS: 'users/receive',
};

function receiveUsersActionCreator(users) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users,
    },
  };
}

function asyncRegisterUser({ name, email, password }) {
  return async (dispatch) => {
    dispatch(showLoadingActionCreator());
    try {
      await api.register({ name, email, password });
      dispatch(
        showModalActionCreator({
          title: 'Pendaftaran Berhasil',
          message: 'Akun Anda berhasil dibuat. Silakan masuk untuk mulai berdiskusi.',
          type: 'success',
        })
      );
      return { error: false };
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Pendaftaran Gagal',
          message: error.message || 'Terjadi kendala saat mendaftarkan akun.',
          type: 'error',
        })
      );
      return { error: true, message: error.message };
    } finally {
      dispatch(hideLoadingActionCreator());
    }
  };
}

export {
  ActionType,
  receiveUsersActionCreator,
  asyncRegisterUser,
};

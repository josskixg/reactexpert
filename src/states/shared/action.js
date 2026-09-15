import api from '../../api/api';
import { receiveUsersActionCreator } from '../users/action';
import { receiveThreadsActionCreator } from '../threads/action';
import { showLoadingActionCreator, hideLoadingActionCreator } from '../loading/action';
import { showModalActionCreator } from '../modal/action';

function asyncPopulateUsersAndThreads() {
  return async (dispatch) => {
    dispatch(showLoadingActionCreator());
    try {
      const [users, threads] = await Promise.all([
        api.getAllUsers(),
        api.getAllThreads(),
      ]);
      dispatch(receiveUsersActionCreator(users));
      dispatch(receiveThreadsActionCreator(threads));
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Gagal Memuat Data',
          message: error.message || 'Terjadi gangguan saat memuat data diskusi.',
          type: 'error',
        })
      );
    } finally {
      dispatch(hideLoadingActionCreator());
    }
  };
}

export {
  asyncPopulateUsersAndThreads,
};

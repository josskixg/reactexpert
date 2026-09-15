import api from '../../api/api';
import { showLoadingActionCreator, hideLoadingActionCreator } from '../loading/action';
import { showModalActionCreator } from '../modal/action';

const ActionType = {
  RECEIVE_LEADERBOARDS: 'leaderboards/receive',
};

function receiveLeaderboardsActionCreator(leaderboards) {
  return {
    type: ActionType.RECEIVE_LEADERBOARDS,
    payload: {
      leaderboards,
    },
  };
}

function asyncReceiveLeaderboards() {
  return async (dispatch) => {
    dispatch(showLoadingActionCreator());
    try {
      const leaderboards = await api.getLeaderboards();
      dispatch(receiveLeaderboardsActionCreator(leaderboards));
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Gagal Memuat Klasemen',
          message: error.message || 'Terjadi kesalahan saat mengambil data klasemen.',
          type: 'error',
        })
      );
    } finally {
      dispatch(hideLoadingActionCreator());
    }
  };
}

export {
  ActionType,
  receiveLeaderboardsActionCreator,
  asyncReceiveLeaderboards,
};

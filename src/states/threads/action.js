import api from '../../api/api';
import { showLoadingActionCreator, hideLoadingActionCreator } from '../loading/action';
import { showModalActionCreator } from '../modal/action';

const ActionType = {
  RECEIVE_THREADS: 'threads/receive',
  ADD_THREAD: 'threads/add',
  TOGGLE_UPVOTE_THREAD: 'threads/toggleUpvote',
  TOGGLE_DOWNVOTE_THREAD: 'threads/toggleDownvote',
  NEUTRALIZE_VOTE_THREAD: 'threads/neutralizeVote',
};

function receiveThreadsActionCreator(threads) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads,
    },
  };
}

function addThreadActionCreator(thread) {
  return {
    type: ActionType.ADD_THREAD,
    payload: {
      thread,
    },
  };
}

function toggleUpvoteThreadActionCreator({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_UPVOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function toggleDownvoteThreadActionCreator({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_DOWNVOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function neutralizeVoteThreadActionCreator({ threadId, userId }) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function asyncAddThread({ title, body, category = '' }) {
  return async (dispatch) => {
    dispatch(showLoadingActionCreator());
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThreadActionCreator(thread));
      dispatch(
        showModalActionCreator({
          title: 'Diskusi Diterbitkan',
          message: 'Topik diskusi Anda telah berhasil dibuat dan dapat dilihat oleh pengguna lain.',
          type: 'success',
        })
      );
      return { error: false };
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Gagal Membuat Diskusi',
          message: error.message || 'Terjadi kendala saat menerbitkan diskusi.',
          type: 'error',
        })
      );
      return { error: true, message: error.message };
    } finally {
      dispatch(hideLoadingActionCreator());
    }
  };
}

function asyncToggleUpvoteThread(threadId) {
  return async (dispatch, getState) => {
    const { authUser, threads } = getState();
    if (!authUser) {
      dispatch(
        showModalActionCreator({
          title: 'Perlu Masuk',
          message: 'Silakan masuk ke akun Anda terlebih dahulu untuk memberikan penilaian.',
          type: 'info',
        })
      );
      return;
    }

    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return;

    const isUpvoted = thread.upVotesBy.includes(authUser.id);

    // Optimistically update
    if (isUpvoted) {
      dispatch(neutralizeVoteThreadActionCreator({ threadId, userId: authUser.id }));
    } else {
      dispatch(toggleUpvoteThreadActionCreator({ threadId, userId: authUser.id }));
    }

    try {
      if (isUpvoted) {
        await api.neutralizeVoteThread(threadId);
      } else {
        await api.upVoteThread(threadId);
      }
    } catch (error) {
      // Revert optimistic update
      dispatch(
        showModalActionCreator({
          title: 'Gagal Memperbarui Vote',
          message: error.message || 'Terjadi kesalahan pada server.',
          type: 'error',
        })
      );
      if (isUpvoted) {
        dispatch(toggleUpvoteThreadActionCreator({ threadId, userId: authUser.id }));
      } else {
        dispatch(neutralizeVoteThreadActionCreator({ threadId, userId: authUser.id }));
      }
    }
  };
}

function asyncToggleDownvoteThread(threadId) {
  return async (dispatch, getState) => {
    const { authUser, threads } = getState();
    if (!authUser) {
      dispatch(
        showModalActionCreator({
          title: 'Perlu Masuk',
          message: 'Silakan masuk ke akun Anda terlebih dahulu untuk memberikan penilaian.',
          type: 'info',
        })
      );
      return;
    }

    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return;

    const isDownvoted = thread.downVotesBy.includes(authUser.id);

    // Optimistically update
    if (isDownvoted) {
      dispatch(neutralizeVoteThreadActionCreator({ threadId, userId: authUser.id }));
    } else {
      dispatch(toggleDownvoteThreadActionCreator({ threadId, userId: authUser.id }));
    }

    try {
      if (isDownvoted) {
        await api.neutralizeVoteThread(threadId);
      } else {
        await api.downVoteThread(threadId);
      }
    } catch (error) {
      // Revert optimistic update
      dispatch(
        showModalActionCreator({
          title: 'Gagal Memperbarui Vote',
          message: error.message || 'Terjadi kesalahan pada server.',
          type: 'error',
        })
      );
      if (isDownvoted) {
        dispatch(toggleDownvoteThreadActionCreator({ threadId, userId: authUser.id }));
      } else {
        dispatch(neutralizeVoteThreadActionCreator({ threadId, userId: authUser.id }));
      }
    }
  };
}

export {
  ActionType,
  receiveThreadsActionCreator,
  addThreadActionCreator,
  toggleUpvoteThreadActionCreator,
  toggleDownvoteThreadActionCreator,
  neutralizeVoteThreadActionCreator,
  asyncAddThread,
  asyncToggleUpvoteThread,
  asyncToggleDownvoteThread,
};
